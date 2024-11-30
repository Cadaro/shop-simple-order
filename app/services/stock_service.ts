import Stock from '#models/stock';
import { IItemWithQty, IStock } from '#types/stock';
import db from '@adonisjs/lucid/services/db';
import { randomUUID } from 'crypto';

export default class StockService {
  async isStockAvailable(stocks: Array<IItemWithQty>) {
    const foundStock = await Stock.query().whereIn(
      'item_id',
      stocks.map((s) => s.itemId)
    );
    for (const stock of stocks) {
      const stockItem = foundStock.find((s) => s.itemId === stock.itemId);
      if (!stockItem || stockItem.availableQty < stock.qty) {
        return false;
      }
    }
    return true;
  }

  async fetchSingleStockItem(itemId: string) {
    const singleStock = await Stock.findBy({ itemId });
    await singleStock!.load('photos');
    return singleStock;
  }

  async fetchAvailableStock() {
    const stocks = await Stock.query().where('available_qty', '>', 0).preload('photos');
    const serializedStock = stocks.map((stock) => stock.serialize()) as Array<IStock>;
    return serializedStock;
  }

  async updateStock(items: Array<IItemWithQty>) {
    const availableStock = await this.isStockAvailable(items);
    if (!availableStock) {
      throw new Error('Stock is not available');
    }
    await db.transaction(async (trx) => {
      for (const item of items) {
        const stockItem = await Stock.findBy({ itemId: item.itemId }, { client: trx });
        if (!stockItem) {
          throw new Error(`Stock item ${item.itemId} not found`);
        }
        stockItem.availableQty -= item.qty;
        stockItem.useTransaction(trx);
        await stockItem.save();
      }
    });
  }

  async createSingleItemStock(stock: IStock) {
    stock.itemId = stock.itemId ?? randomUUID();
    const exists = await Stock.findBy({ itemId: stock.itemId });
    if (exists) {
      throw new Error(`Stock item = ${stock.itemId} already exists`);
    }
    const createdStockId = await db.transaction(async (trx) => {
      const savedStockHead = await Stock.create(stock, { client: trx });
      const savedStockPhotos = await savedStockHead.related('photos').createMany(stock.photos);

      if (!savedStockHead || !savedStockPhotos) {
        throw new Error(`Could not create new stock item = ${stock.itemId}`);
      }

      return savedStockHead.id;
    });
    return createdStockId;
  }
}

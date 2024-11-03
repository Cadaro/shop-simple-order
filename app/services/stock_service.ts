import Item from '#models/item';
import { IItem, IItemWithQty } from '#types/item';
import db from '@adonisjs/lucid/services/db';

export default class StockService {
  async isStockAvailable(itemList: Array<IItemWithQty>) {
    const stock = await Item.query().whereIn(
      'item_id',
      itemList.map((i) => i.itemId)
    );
    for (const item of itemList) {
      const stockItem = stock.find((item) => item.itemId === item.itemId);
      if (!stockItem || stockItem.availableQty < item.qty) {
        // Not enough stock
        return false;
      }
    }
    //Available stock to order
    return true;
  }

  async fetchSingleItem(itemId: string) {
    const item = await Item.findBy({ itemId });
    return item ? (item.serialize() as IItem) : null;
  }

  async fetchAvailableStock() {
    const itemList: Array<IItem> = await Item.query().where('available_qty', '>', 0);
    return itemList;
  }

  async updateStock(itemList: Array<IItemWithQty>) {
    const availableStock = await this.isStockAvailable(itemList);
    if (!availableStock) {
      throw new Error('Stock is not available');
    }
    await db.transaction(async (trx) => {
      for (const item of itemList) {
        const stockItem = await Item.findBy({ itemId: item.itemId }, { client: trx });
        if (!stockItem) {
          throw new Error(`Item ${item.itemId} not found`);
        }
        if (stockItem.availableQty < item.qty) {
          throw new Error(`Stock is not available for item ${item.itemId}`);
        }
        stockItem.availableQty -= item.qty;
        stockItem.useTransaction(trx);
        await stockItem.save();
      }
    });
  }
}

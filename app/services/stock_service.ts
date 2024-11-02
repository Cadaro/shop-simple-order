import Item from '#models/item';
import { IItem, IItemOrder } from '#types/item';
import db from '@adonisjs/lucid/services/db';

export default class StockService {
  public async isStockAvailable(orderedItems: Array<IItemOrder>) {
    const stock = await Item.query().whereIn(
      'item_id',
      orderedItems.map((i) => i.itemId)
    );
    for (const orderedItem of orderedItems) {
      const stockItem = stock.find((item) => item.itemId === orderedItem.itemId);
      if (!stockItem || stockItem.availableQty < orderedItem.reservedQty) {
        // Not enough stock
        return false;
      }
    }
    //Available stock to order
    return true;
  }

  async fetchSingleItem(itemId: string) {
    const item = await Item.findBy({ itemId });
    return item;
  }

  async fetchStock() {
    const items = await Item.query().where('available_qty', '>', 0);
    const mappedItems = Array<IItem>();
    items.map((i) => {
      mappedItems.push({
        itemId: i.itemId,
        itemDescription: i.itemDescription,
        name: i.name,
        price: i.price,
        priceCurrency: i.priceCurrency,
        size: i.size,
        availableQty: i.availableQty ?? 0,
      });
    });

    return mappedItems;
  }

  async updateStock(orderedItems: Array<IItemOrder>) {
    const availableStock = await this.isStockAvailable(orderedItems);
    if (!availableStock) {
      throw new Error('Stock is not available');
    }
    await db
      .transaction(async (trx) => {
        for (const orderedItem of orderedItems) {
          const item = await Item.findBy({ itemId: orderedItem.itemId }, { client: trx });
          if (!item) {
            throw new Error(`Item ${orderedItem.itemId} not found`);
          }
          if (item.availableQty < orderedItem.reservedQty) {
            throw new Error(`Stock is not available for item ${orderedItem.itemId}`);
          }
          item.availableQty -= orderedItem.reservedQty;
          item.useTransaction(trx);
          await item.save();
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}

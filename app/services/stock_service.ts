import Item from '#models/item';
import { IItemUpdate } from '#types/item';
import db from '@adonisjs/lucid/services/db';

export default class StockService {
  isStockAvailable(stock: Array<Item>, orderedItems: Array<IItemUpdate>) {
    for (const orderedItem of orderedItems) {
      const stockItem = stock.find((item) => item.itemId === orderedItem.itemId);
      if (!stockItem || stockItem.availableQty < orderedItem.itemReservedQty) {
        // Not enough stock
        return false;
      }
    }
    //Available stock to order
    return true;
  }

  async updateStock(orderedItems: Array<IItemUpdate>) {
    await db
      .transaction(async (trx) => {
        for (const orderedItem of orderedItems) {
          const item = await Item.findBy({ itemId: orderedItem.itemId }, { client: trx });
          if (!item) {
            throw new Error(`Item ${orderedItem.itemId} not found`);
          }
          if (item.availableQty < orderedItem.itemReservedQty) {
            throw new Error(`Stock is not available for item ${orderedItem.itemId}`);
          }
          item.availableQty -= orderedItem.itemReservedQty;
          item.useTransaction(trx);
          await item.save();
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}

import Item from '#models/item';
import { IItem, IItemWithQty } from '#types/item';
import db from '@adonisjs/lucid/services/db';

export default class StockService {
  private async isStockAvailable(itemList: Array<IItemWithQty>) {
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
    return item
      ? ({
          itemId: item.itemId,
          availableQty: item.availableQty,
          itemDescription: item.itemDescription,
          name: item.name,
          price: item.price,
          priceCurrency: item.priceCurrency,
          size: item.size,
        } as IItem)
      : null;
  }

  async fetchItemList(itemList: Array<IItemWithQty>) {
    const itemArr = await Item.query().whereIn(
      'item_id',
      itemList.map((i) => i.itemId)
    );
    const mappedItems = Array<IItem>();
    itemArr.map((i) => {
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

  async fetchAvailableStock() {
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

  async updateStock(itemList: Array<IItemWithQty>) {
    const availableStock = await this.isStockAvailable(itemList);
    if (!availableStock) {
      throw new Error('Stock is not available');
    }
    await db
      .transaction(async (trx) => {
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
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}

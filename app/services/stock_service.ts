import Item from '#models/item';
import { IItemUpdate } from '#types/item';

export default class StockService {
  async updateStock({ itemId, itemReservedQty }: IItemUpdate) {
    const itemDb = await Item.findBy({ itemId });
    if (!itemDb) {
      throw new Error('Item not found for stock update');
    }

    if (itemDb!.availableQty < itemReservedQty) {
      throw new Error(
        `Item ${itemId} has stock equal to ${itemDb!.availableQty}, but requested stock is ${itemReservedQty}. Stock update is not possible`
      );
    }

    itemDb!.availableQty -= itemReservedQty;
    await itemDb.save();
  }
}

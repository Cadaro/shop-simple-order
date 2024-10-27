import type { HttpContext } from '@adonisjs/core/http';
import Item from '#models/item';
import { IItem } from '#types/item';

export default class ItemsController {
  async index({ response }: HttpContext) {
    const items = await Item.all();
    const mappedItems = Array<IItem>();
    for (const i of items) {
      mappedItems.push({
        itemId: i.itemId,
        itemDescription: i.itemDescription,
        itemName: i.name,
        itemPrice: i.price,
        itemPriceCurrency: i.priceCurrency,
        itemSize: i.size,
        itemAvailableQty: Boolean(i.availableQty) ? i.availableQty : 0,
      });
    }
    return response.status(200).send(mappedItems);
  }

  async show({ params, response }: HttpContext) {
    const item = await Item.findBy('id', params.id);
    if (!item) {
      return response.notFound();
    }
    return response.status(200).send(item);
  }
}

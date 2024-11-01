import type { HttpContext } from '@adonisjs/core/http';
import Item from '#models/item';
import { IItem } from '#types/item';
import { updateItemValidator } from '#validators/item';

export default class ItemsController {
  async index({ response }: HttpContext) {
    const items = await Item.all();
    const mappedItems = Array<IItem>();
    for (const i of items) {
      if (i.availableQty <= 0) {
        continue;
      }
      mappedItems.push({
        itemId: i.itemId,
        itemDescription: i.itemDescription,
        name: i.name,
        price: i.price,
        priceCurrency: i.priceCurrency,
        size: i.size,
        availableQty: Boolean(i.availableQty) ? i.availableQty : 0,
      });
    }
    return response.status(200).send(mappedItems);
  }

  async show({ params, response }: HttpContext) {
    const item = await Item.findBy('id', params.id);
    if (!item || item.availableQty <= 0) {
      return response.notFound();
    }
    return response.status(200).send(item);
  }
}

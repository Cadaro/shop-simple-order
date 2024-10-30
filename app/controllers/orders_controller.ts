import Item from '#models/item';
import Order from '#models/order';
import { createOrderDetailValidator } from '#validators/order_detail';
import type { HttpContext } from '@adonisjs/core/http';
import { randomUUID } from 'crypto';
import { IOrderData, IOrderHead, IOrderSku } from '#types/order';
import env from '#start/env';
import { IItemUpdate } from '#types/item';

export default class OrdersController {
  async index({ auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    const orderHead: IOrderHead[] = await Order.findManyBy('userId', auth.user!.id);

    return response.status(200).send(orderHead);
  }

  async store({ auth, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    const orderId = randomUUID();
    const orderedItems = await request.validateUsing(createOrderDetailValidator);

    const orderHead: IOrderHead = { orderId, userId: auth.user!.id };
    let orderSku = Array<IOrderSku>();

    for (const o of orderedItems.data) {
      const item = await Item.findBy({ itemId: o.itemId });
      if (!item) {
        return response.badRequest();
      }
      orderSku.push({
        itemId: o.itemId,
        qty: o.qty,
        itemPrice: item!.price,
        currency: item!.priceCurrency,
      });
    }

    const itemUpdate: IItemUpdate = {
      itemId: orderedItems.data[0].itemId,
      itemReservedQty: orderedItems.data[0].qty,
    };

    const res = await fetch(
      `${env.get('PROTOCOL')}://${env.get('HOST')}:${env.get('PORT')}/api/items/`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(itemUpdate),
      }
    );

    if (res.status !== 204) {
      const err = await res.json();
      return response.conflict(err);
    }

    const savedOrderHead = await Order.create(orderHead);

    const savedOrderSku = await savedOrderHead.related('order_details').createMany(orderSku);

    if (!savedOrderSku) {
      return response.internalServerError();
    }

    const createdOrder: IOrderData = {
      orderId,
      items: orderSku,
    };

    return response.status(200).send(createdOrder);
  }

  async show({ auth, params, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    const orderHead = await auth
      .user!.related('orders')
      .query()
      .where('orderId', params.id)
      .first();

    if (!orderHead) {
      return response.notFound();
    }

    const orderSku: Array<IOrderSku> = await orderHead!.related('order_details').query();

    const foundOrder: IOrderData = {
      orderId: orderHead!.orderId,
      items: orderSku,
    };

    return response.status(200).send(foundOrder);
  }
}

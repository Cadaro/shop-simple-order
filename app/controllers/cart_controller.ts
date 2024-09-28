import { ICart } from '#types/cart';
import { createCartValidator, updateCartValidator } from '#validators/cart';
import type { HttpContext } from '@adonisjs/core/http';

export default class CartController {
  async index({ request, response }: HttpContext) {
    const cartItem = request.cookie('cart_items') as Array<ICart>;
    return response.status(200).send(cartItem);
  }

  async store({ request, response }: HttpContext) {
    const newCartItem = await request.validateUsing(createCartValidator);
    const cartItem = (request.cookie('cart_items') as Array<ICart>)
      ? (request.cookie('cart_items') as Array<ICart>)
      : Array<ICart>();

    const existingCartItemIndex = cartItem.findIndex((item) => item.itemId === newCartItem.itemId);

    if (existingCartItemIndex === -1) {
      cartItem.push(newCartItem);
    } else {
      cartItem[existingCartItemIndex].qty += newCartItem.qty;
    }

    return response.cookie('cart_items', cartItem).noContent();
  }

  async update({ params, request, response }: HttpContext) {
    if (request.intended() !== 'PATCH') {
      return response.methodNotAllowed();
    }
    const cartItem = request.cookie('cart_items') as Array<ICart>;
    const itemId = params.id;
    const cartItemIndex = cartItem.findIndex((item) => item.itemId === itemId);
    if (!cartItem || cartItemIndex === -1) {
      return response.notFound();
    }
    const cartUpdate = await request.validateUsing(updateCartValidator);

    let actionStatus = '';

    if (cartUpdate.qty === 0) {
      cartItem.splice(cartItemIndex, 1);
      actionStatus = 'ITEM REMOVED';
    } else {
      cartItem[cartItemIndex].qty = cartUpdate.qty;
      actionStatus = 'ITEM QTY UPDATED';
    }

    return response.cookie('cart_items', cartItem).status(200).send({ cartItem, actionStatus });
  }

  async destroy({ response }: HttpContext) {
    return response.clearCookie('cart_items');
  }
}

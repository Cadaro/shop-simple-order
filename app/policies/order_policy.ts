import User from '#models/user';
import Order from '#models/order';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class OrderPolicy extends BasePolicy {
  view(user: User, order: Order): AuthorizerResponse {
    return user.id === order.userId;
  }
}

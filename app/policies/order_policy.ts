import User from '#models/user';
import Order from '#models/order';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';
import { UserAbilitiesEnum, UserRolesEnum } from '#types/user';

export default class OrderPolicy extends BasePolicy {
  view(user: User, order: Order): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return false;
    }
    return (
      user.id === order.userId &&
      user.role === UserRolesEnum.USER &&
      user.currentAccessToken.allows(UserAbilitiesEnum.ORDERS_VIEW)
    );
  }
  viewList(user: User): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return false;
    }
    return (
      user.role === UserRolesEnum.USER &&
      user.currentAccessToken.allows(UserAbilitiesEnum.ORDERS_VIEW)
    );
  }
  create(user: User): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return user.role === UserRolesEnum.USER;
    }

    return (
      user.role === UserRolesEnum.USER &&
      user.currentAccessToken.allows(UserAbilitiesEnum.ORDERS_CREATE)
    );
  }
}

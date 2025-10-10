import User from '#models/user';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';
import { UserAbilitiesEnum, UserRolesEnum } from '#types/user';

export default class StockPolicy extends BasePolicy {
  /**
   * Only admins can create stocks
   * Uses the wildcard '*' ability that admins have
   */
  create(user: User): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return false;
    }

    return (
      user.role === UserRolesEnum.ADMIN && user.currentAccessToken.allows(UserAbilitiesEnum.ADMIN)
    );
  }
}

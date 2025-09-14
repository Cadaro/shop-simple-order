import User from '#models/user';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';
import { UserAbilitiesEnum, UserRolesEnum } from '#types/user';

export default class StockPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return user.role === UserRolesEnum.ADMIN;
    }

    return (
      user.role === UserRolesEnum.ADMIN && user.currentAccessToken.allows(UserAbilitiesEnum.ALL)
    );
  }
}

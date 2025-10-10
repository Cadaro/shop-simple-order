import User from '#models/user';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class UserPolicy extends BasePolicy {
  /**
   * User middleware ensures authentication and abilities
   * Any authenticated user can view their own data
   */
  view(_user: User): AuthorizerResponse {
    return true;
  }

  /**
   * User middleware ensures authentication and abilities
   * Any authenticated user can edit their own data
   */
  edit(_user: User): AuthorizerResponse {
    return true;
  }
}

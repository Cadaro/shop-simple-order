import User from '#models/user';
import { UserAbilitiesEnum, UserRolesEnum } from '#types/user';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class UserPolicy extends BasePolicy {
  /**
   * Checks if the user can view their own data:
   * - must have USER role,
   * - must have the USERS_VIEW ability.
   */
  view(user: User): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return false;
    }
    return (
      user.role === UserRolesEnum.USER &&
      user.currentAccessToken.allows(UserAbilitiesEnum.USERS_VIEW)
    );
  }

  /** Allow user to edit their own data
   * - must have USER role,
   * - must have the USERS_UPDATE ability,
   * - can edit only their own data.
   */
  edit(user: User): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return false;
    }
    return (
      user.role === UserRolesEnum.USER &&
      user.currentAccessToken.allows(UserAbilitiesEnum.USERS_UPDATE)
    );
  }
}

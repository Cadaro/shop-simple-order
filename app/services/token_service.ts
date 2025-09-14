import { UserAbilitiesEnum, UserRolesEnum } from '#types/user';
import User from '#models/user';
import { Token, TokenProvider, TokenTypeEnum } from '#types/token';
import stringHelpers from '@adonisjs/core/helpers/string';

export default class TokenService implements TokenProvider {
  /**
   * Get user abilities based on role
   */
  private getUserAbilities(role: UserRolesEnum): UserAbilitiesEnum[] {
    const abilities: UserAbilitiesEnum[] = [];

    /*
     * Create access token with abilities:
     * - '*' for all abilities (admin)
     * - 'orders:create' for creating orders
     * - 'orders:view' for viewing orders
     * - 'users:update' for updating user data (non-admin)
     * - 'stocks:view' for viewing stock (non-admin)
     */

    if (role === UserRolesEnum.ADMIN) {
      abilities.push(UserAbilitiesEnum.ALL);
    } else {
      abilities.push(
        UserAbilitiesEnum.ORDERS_CREATE,
        UserAbilitiesEnum.ORDERS_VIEW,
        UserAbilitiesEnum.USERS_VIEW,
        UserAbilitiesEnum.USERS_UPDATE,
        UserAbilitiesEnum.STOCKS_VIEW
      );
    }

    return abilities;
  }

  /**
   * Create token for user
   */
  public async createToken(user: User, expiresIn?: string): Promise<Token> {
    // Get abilities based on user role
    const abilities = this.getUserAbilities(user.role);

    // Set token expiration time, default to 24h
    const tokenExpiresIn = expiresIn ?? '24h';

    const availableTokens = await User.accessTokens.all(user);

    if (availableTokens.length > 1) {
      /**
       * prevent multiple access tokens for one user
       */
      await User.accessTokens.delete(user, availableTokens[0].identifier);
    }

    const userAccessToken = await User.accessTokens.create(user, abilities, {
      expiresIn: tokenExpiresIn,
    });

    const token: Token = {
      type: TokenTypeEnum.BEARER,
      token: userAccessToken.value!.release(),
      expiresAt: new Date(
        userAccessToken.expiresAt!.getTime() + stringHelpers.seconds.parse(tokenExpiresIn)
      ),
    };
    return token;
  }
}

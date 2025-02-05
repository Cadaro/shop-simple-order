import User from '#models/user';
import { IToken, TokenTypeEnum } from '#types/token';
import { createAuthValidator } from '#validators/auth';
import stringHelpers from '@adonisjs/core/helpers/string';
import type { HttpContext } from '@adonisjs/core/http';

export default class TokenController {
  /**
   * create access token
   */
  async store({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(createAuthValidator);

    const user = await User.verifyCredentials(email, password);

    const availableTokens = await User.accessTokens.all(user);

    if (availableTokens.length > 1) {
      /**
       * prevent multiple access tokens for one user
       */
      await User.accessTokens.delete(user, availableTokens[0].identifier);
    }

    const userAccessToken = await User.accessTokens.create(user, ['*'], { expiresIn: '24h' });

    const token: IToken = {
      type: TokenTypeEnum.BEARER,
      token: userAccessToken.value!.release(),
      expiresAt: new Date(
        userAccessToken.expiresAt!.getTime() + stringHelpers.seconds.parse('24h')
      ),
    };

    return response.status(200).send(token);
  }
}

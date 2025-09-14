import User from '#models/user';
import TokenService from '#services/token_service';
import { createAuthValidator } from '#validators/auth';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class TokenController {
  constructor(private tokenService: TokenService) {}
  /**
   * create access token
   * POST /token
   */
  async store({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(createAuthValidator);

    const user = await User.verifyCredentials(email, password);

    if (!user) {
      return response.unauthorized();
    }

    const token = await this.tokenService.createToken(user);

    return response.ok(token);
  }
}

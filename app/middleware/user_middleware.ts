import ResponseErrorHandler from '#exceptions/response';
import { StatusCodeEnum } from '#types/response';
import { Authenticators } from '@adonisjs/auth/types';
import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

/**
 * User middleware ensures the authenticated user has basic access.
 * This is for endpoints that require authentication but don't need admin privileges.
 * Accepts any authenticated user with a valid token.
 */
export default class UserMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = { guards: ['api'] }
  ) {
    const { auth, response } = ctx;

    await ctx.auth.authenticateUsing(options.guards);

    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      return new ResponseErrorHandler().handleError(
        response,
        StatusCodeEnum.Unauthorized,
        new Error('Authentication required')
      );
    }

    const user = auth.user!;

    // Check if user has current access token
    if (!user.currentAccessToken) {
      return new ResponseErrorHandler().handleError(
        response,
        StatusCodeEnum.Unauthorized,
        new Error('Valid access token required')
      );
    }

    // Allow any authenticated user with a valid token
    return next();
  }
}

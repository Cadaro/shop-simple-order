import ResponseErrorHandler from '#exceptions/response';
import UserService from '#services/user_service';
import { StatusCodeEnum } from '#types/response';
import { createUserValidator } from '#validators/user';
import type { HttpContext } from '@adonisjs/core/http';

export default class UsersController {
  async store({ request, response }: HttpContext) {
    const validatedUserData = await request.validateUsing(createUserValidator);
    try {
      const userService = new UserService();
      const createdUser = await userService.createUser(validatedUserData);
      return response.ok({ userId: createdUser.userId });
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }

  async index({ auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    return response.status(200).send(auth.user);
  }

  async update({ auth, params, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (!auth.user!.id !== params.id) {
      return response.forbidden();
    }
    try {
      const { firstName, lastName } = request.only(['firstName', 'lastName']);
      const userService = new UserService();
      await userService.updateUser({ userId: params.id, firstName, lastName });
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }
}

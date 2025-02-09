import ResponseErrorHandler from '#exceptions/response';
import UserService from '#services/user_service';
import { StatusCodeEnum } from '#types/response';
import { IUserData } from '#types/user';
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

    const userData: IUserData = {
      userId: auth.user!.id,
      email: auth.user!.email,
      firstName: auth.user?.firstName ?? null,
      lastName: auth.user?.lastName ?? null,
    };

    return response.status(200).send(userData);
  }

  async update({ auth, params, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (auth.user!.id !== parseInt(params.id)) {
      return response.forbidden();
    }

    try {
      const { firstName, lastName } = request.only(['firstName', 'lastName']);
      if (!firstName && !lastName) {
        return response.noContent();
      }
      const userService = new UserService();
      await userService.updateUser({ userId: params.id, firstName, lastName });
      return response.noContent();
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }
}

import ResponseErrorHandler from '#exceptions/response';
import UserService from '#services/user_service';
import { StatusCodeEnum } from '#types/response';
import { IUserData } from '#types/user';
import { createUserValidator, updateUserValidator } from '#validators/user';
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

    const userService = new UserService();

    const userData: IUserData = await userService.fetchUserData(auth.user!.uuid);

    return response.ok(userData);
  }

  async update({ auth, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    try {
      const validatedUserData = await request.validateUsing(updateUserValidator);
      if (
        !validatedUserData.firstName &&
        !validatedUserData.lastName &&
        !validatedUserData.invoiceAddress
      ) {
        return response.noContent();
      }
      const userService = new UserService();
      //todo: usuwanie wartości pola, które jest nullowe
      await userService.updateUser({ userId: auth.user!.uuid, ...validatedUserData });
      return response.noContent();
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }
}

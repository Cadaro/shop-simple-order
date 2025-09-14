import ResponseErrorHandler from '#exceptions/response';
import UserPolicy from '#policies/user_policy';
import UserService from '#services/user_service';
import { StatusCodeEnum } from '#types/response';
import { UserData } from '#types/user';
import { createUserValidator, updateUserValidator } from '#validators/user';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class UsersController {
  constructor(private userService: UserService) {}

  /**
   * create new user
   * POST /users
   */
  async store({ request, response }: HttpContext) {
    const validatedUserData = await request.validateUsing(createUserValidator);
    try {
      const createdUser = await this.userService.createUser(validatedUserData);
      return response.ok({ userId: createdUser.userId });
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }

  async index({ auth, bouncer, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (await bouncer.with(UserPolicy).denies('view')) {
      return response.forbidden();
    }

    const userService = new UserService();

    const userData: UserData = await userService.fetchUserData(auth.user!.uuid);

    return response.ok(userData);
  }

  async update({ auth, bouncer, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (await bouncer.with(UserPolicy).denies('edit')) {
      return response.forbidden();
    }

    try {
      const validatedUserData = await request.validateUsing(updateUserValidator);
      if (!validatedUserData.firstName && !validatedUserData.lastName) {
        return response.badRequest();
      }
      //todo: usuwanie wartości pola, które jest nullowe
      await this.userService.updateUser({ userId: auth.user!.uuid, ...validatedUserData });
      return response.noContent();
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }
}

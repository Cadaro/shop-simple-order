import UserService from '#services/user_service';
import { createUserValidator } from '#validators/user';
import type { HttpContext } from '@adonisjs/core/http';

export default class UsersController {
  async store({ request, response }: HttpContext) {
    const validatedUserData = await request.validateUsing(createUserValidator);
    const userService = new UserService();
    const createdUser = await userService.createUser(validatedUserData);

    if (!createdUser.userId) {
      return response.internalServerError();
    }

    return response.ok({ userId: createdUser.userId });
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

    if (!auth.user!.id === params.id) {
      return response.forbidden();
    }

    const { firstName, lastName } = request.only(['firstName', 'lastName']);
    const userService = new UserService();
    await userService.updateUser({ userId: params.id, firstName, lastName });
  }
}

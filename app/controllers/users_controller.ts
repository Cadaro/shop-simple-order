import User from '#models/user';
import { createUserValidator } from '#validators/user';
import type { HttpContext } from '@adonisjs/core/http';

export default class UsersController {
  async store({ request, response }: HttpContext) {
    const validatedUserData = await request.validateUsing(createUserValidator);
    const dbSave = await User.create(validatedUserData);

    if (!dbSave) {
      return response.internalServerError();
    }

    return response.noContent();
  }

  async index({ auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }
    return response.status(200).send(auth.user);
  }
}

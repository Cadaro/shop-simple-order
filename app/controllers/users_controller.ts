import User from '#models/user'
import { createUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Create user
   */
  async store({ request, response }: HttpContext) {
    const validatedUserData = await request.validateUsing(createUserValidator)
    const dbSave = await User.create(validatedUserData)

    response.status(200).send({ userId: dbSave.id })
  }

  async index({ auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized()
    }
    return response.status(200).send(auth.user)
  }
}

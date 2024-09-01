import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'

export default class ItemsController {
  async index({ response }: HttpContext) {
    const items = await Item.all()
    response.status(200).send(items)
  }

  async show({ params, response }: HttpContext) {
    const item = await Item.findBy('id', params.id)
    if (!item) {
      return response.notFound()
    }
    return response.status(200).send(item)
  }
}

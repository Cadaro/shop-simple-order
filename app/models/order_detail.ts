import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class OrderDetail extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: string

  @column()
  declare itemId: string

  @column()
  declare qty: number

  @column()
  declare itemPrice: number

  @column()
  declare currency: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

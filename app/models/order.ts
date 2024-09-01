import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import OrderDetail from '#models/order_detail'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Order extends BaseModel {
  @hasMany(() => OrderDetail, { foreignKey: 'orderId', localKey: 'orderId' })
  declare order_details: HasMany<typeof OrderDetail>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: string

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

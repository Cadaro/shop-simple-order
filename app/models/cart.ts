import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare sessionId: string;

  @column()
  declare itemId: string;

  @column()
  declare itemName: string;

  @column()
  declare qty: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}

import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Item extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  declare id: number;

  @column()
  declare itemId: string;

  @column()
  declare itemDescription: string;

  @column()
  declare price: number;

  @column()
  declare priceCurrency: string;

  @column()
  declare name: string;

  @column()
  declare size: string;

  @column()
  declare availableQty: number;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime;
}

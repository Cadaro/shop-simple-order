import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class StockPhoto extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  declare id: number;

  @column({ serializeAs: null })
  declare itemId: string;

  @column()
  declare url: string;

  @column()
  declare name: string;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime;
}

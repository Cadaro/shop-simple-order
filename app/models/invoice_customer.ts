import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import { CountryCode } from '#types/countryCode';

export default class InvoiceCustomers extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  declare id: number;

  @column({ serializeAs: null })
  declare userId: string;

  @column()
  declare firstName: string;

  @column()
  declare lastName: string;

  @column()
  declare streetName: string;

  @column()
  declare streetNumber: string;

  @column()
  declare apartmentNumber?: string;

  @column()
  declare city: string;

  @column()
  declare postalCode: string;

  @column()
  declare region?: string;

  @column()
  declare countryCode: CountryCode;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}

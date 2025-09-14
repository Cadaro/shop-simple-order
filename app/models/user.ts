import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations';
import Order from '#models/order';
import InvoiceCustomers from '#models/invoice_customer';
import { UserRolesEnum } from '#types/user';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
  currentAccessToken?: AccessToken;
  @hasMany(() => Order, { foreignKey: 'userId' })
  declare orders: HasMany<typeof Order>;

  @hasOne(() => InvoiceCustomers, { foreignKey: 'userId', localKey: 'uuid' })
  declare invoice_customers: HasOne<typeof InvoiceCustomers>;

  @column({ isPrimary: true, serializeAs: null })
  declare id: number;

  @column()
  declare firstName?: string;

  @column()
  declare lastName?: string;

  @column()
  declare email: string;

  @column({ serializeAs: null })
  declare password: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column({ serializeAs: 'userId' })
  declare uuid: string;

  @column()
  declare role: UserRolesEnum;

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '24h',
    prefix: 'oat_',
  });
}

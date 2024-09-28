import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import Order from '#models/order';
import Cart from '#models/cart';
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
  @hasMany(() => Order, { foreignKey: 'userId' })
  declare orders: HasMany<typeof Order>;

  @hasMany(() => Cart, { foreignKey: 'userId' })
  declare cart: HasMany<typeof Cart>;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare fullName: string | null;

  @column()
  declare email: string;

  @column({ serializeAs: null })
  declare password: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: 3600,
    prefix: 'oat_',
  });
}

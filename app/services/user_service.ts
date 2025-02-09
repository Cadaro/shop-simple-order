import User from '#models/user';
import { IUserData, IUserDb } from '#types/user';
import db from '@adonisjs/lucid/services/db';

export default class UserService {
  async createUser(userData: IUserDb) {
    const user = await db.transaction(async (trx) => {
      const exists = await User.findBy({ email: userData.email }, { client: trx });
      if (exists) {
        throw new Error(`Email ${userData.email} already exists`);
      }
      const createdUser = await User.create(userData, { client: trx });
      if (!createdUser) {
        throw new Error(`Cannot create user account for ${userData.email}`);
      }
      return createdUser.serialize() as IUserData;
    });
    return { userId: user.userId };
  }

  async updateUser(userData: IUserData) {
    await db.transaction(async (trx) => {
      const user = await User.findBy({ id: userData.userId }, { client: trx });
      if (!user) {
        throw new Error(`User ${userData.userId} not found`);
      }
      user.firstName = userData.firstName;
      user.lastName = userData.lastName;
      user.useTransaction(trx);
      await user.save();
    });
  }
}

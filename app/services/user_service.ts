import User from '#models/user';
import { IUserData, IUserDb } from '#types/user';
import db from '@adonisjs/lucid/services/db';

export default class UserService {
  async createUser(userData: IUserDb) {
    const user = await db.transaction(async (trx) => {
      const createdUser = await User.create(userData, { client: trx });
      if (!createdUser) {
        return null;
      }
      return createdUser.serialize() as IUserData;
    });
    return { userId: user?.userId };
  }

  async updateUser(userData: IUserData) {
    await db.transaction(async (trx) => {
      const user = await User.findBy({ id: userData.userId }, { client: trx });
      if (!user) {
        throw new Error(`User ${userData.userId} not found`);
      }
      user.fullName = `${userData.firstName} ${userData?.lastName ?? ''}`.trim();
      user.useTransaction(trx);
      await user.save();
    });
  }
}

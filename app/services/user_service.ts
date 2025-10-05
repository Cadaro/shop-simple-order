import User from '#models/user';
import { UserData, UserDb } from '#types/user';
import db from '@adonisjs/lucid/services/db';
import { randomUUID } from 'crypto';

export default class UserService {
  async createUser(userData: UserDb) {
    const user: UserData = await db.transaction(async (trx) => {
      const exists = await User.findBy({ email: userData.email }, { client: trx });
      if (exists) {
        throw new Error(`Email ${userData.email} already exists`);
      }
      const { email, password, firstName, lastName } = userData;
      const createdUser = await User.create(
        { email, password, firstName, lastName, uuid: randomUUID() },
        { client: trx }
      );
      if (!createdUser) {
        throw new Error(`Cannot create user account for ${userData.email}`);
      }
      return createdUser.serialize() as UserData;
    });
    return { userId: user.userId };
  }

  async updateUser(userData: Partial<UserData>) {
    await db.transaction(async (trx) => {
      const user = await User.findBy({ uuid: userData.userId }, { client: trx });
      if (!user) {
        throw new Error(`User ${userData.userId} not found`);
      }
      await user.merge({ firstName: userData.firstName, lastName: userData.lastName }).save();
    });
  }

  async fetchUserData(uuid: string) {
    const userData = await User.findBy({ uuid });
    if (!userData) {
      throw new Error(`User ${uuid} not found`);
    }

    return userData.serialize() as UserData;
  }
}

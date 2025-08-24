import User from '#models/user';
import { IUserData, IUserDb } from '#types/user';
import db from '@adonisjs/lucid/services/db';
import { randomUUID } from 'crypto';

export default class UserService {
  async createUser(userData: IUserDb) {
    const user: IUserData = await db.transaction(async (trx) => {
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
      return createdUser.serialize() as IUserData;
    });
    return { userId: user.userId };
  }

  async updateUser(userData: IUserData) {
    await db.transaction(async (trx) => {
      const user = await User.findBy({ uuid: userData.userId }, { client: trx });
      if (!user) {
        throw new Error(`User ${userData.userId} not found`);
      }
      await user.merge({ firstName: userData.firstName, lastName: userData.lastName }).save();
      // if (userData.invoiceAddress) {
      //   await user
      //     .related('invoice_customers')
      //     .updateOrCreate({ userId: userData.userId }, { ...userData.invoiceAddress });
      // }
    });
  }

  async fetchUserData(uuid: string) {
    const userData = await User.findBy({ uuid });
    if (!userData) {
      throw new Error(`User ${uuid} not found`);
    }
    await userData.load('invoice_customers');
    return userData.serialize() as IUserData;
  }
}

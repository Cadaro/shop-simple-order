import User from '#models/user';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class UserPolicy extends BasePolicy {
  edit(user: User, uuid: string): AuthorizerResponse {
    return user.uuid === uuid;
  }
}

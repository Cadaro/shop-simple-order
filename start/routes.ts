/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ItemsController from '#controllers/items_controller';
import OrdersController from '#controllers/orders_controller';
import TokenController from '#controllers/token_controller';
import UsersController from '#controllers/users_controller';
import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';
import CartController from '#controllers/cart_controller';

router
  .group(() => {
    router.group(() => {
      router.resource('items', ItemsController).apiOnly().only(['show', 'index']);
      router
        .resource('orders', OrdersController)
        .apiOnly()
        .only(['index', 'store', 'show'])
        .use(['index', 'store', 'show'], middleware.auth());
      router
        .resource('cart', CartController)
        .apiOnly()
        .only(['index', 'store', 'update', 'destroy']);
    });
    router
      .group(() => {
        router
          .resource('users', UsersController)
          .only(['index'])
          .apiOnly()
          .use('index', middleware.auth());
        router.resource('users', UsersController).apiOnly().only(['store']);
        router.resource('token', TokenController).apiOnly().only(['store']);
      })
      .prefix('auth');
  })
  .prefix('api');

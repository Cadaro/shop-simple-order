/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from './kernel.js';
import router from '@adonisjs/core/services/router';
import OrdersController from '#controllers/orders_controller';
import TokenController from '#controllers/token_controller';
import UsersController from '#controllers/users_controller';
import StocksController from '#controllers/stocks_controller';

router
  .group(() => {
    router.group(() => {
      router
        .resource('stocks', StocksController)
        .params({ stocks: 'itemId' })
        .apiOnly()
        .only(['index', 'show', 'store'])
        .use(['store'], middleware.auth());
      router
        .resource('orders', OrdersController)
        .params({ orders: 'orderId' })
        .apiOnly()
        .only(['index', 'store', 'show'])
        .use(['index', 'store', 'show'], middleware.auth());
    });
    router
      .group(() => {
        router
          .resource('users', UsersController)
          .only(['index'])
          .apiOnly()
          .use('index', middleware.auth());
        router.patch('users', [UsersController, 'update']).use(middleware.auth());
        router.resource('users', UsersController).apiOnly().only(['store']);
        router.resource('token', TokenController).apiOnly().only(['store']);
      })
      .prefix('auth');
  })
  .prefix('api');

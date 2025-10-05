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
import InvoiceCustomersController from '#controllers/invoice_customers_controller';

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
      router
        .resource('customers/invoice-data', InvoiceCustomersController)
        .apiOnly()
        .only(['index', 'store'])
        .use(['index', 'store'], middleware.auth());
      router
        .patch('customers/invoice-data', [InvoiceCustomersController, 'update'])
        .use(middleware.auth());
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

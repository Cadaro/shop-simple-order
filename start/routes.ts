/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ItemsController from '#controllers/items_controller'
import OrdersController from '#controllers/orders_controller'
import TokenController from '#controllers/token_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router
  .group(() => {
    router.group(() => {
      router.resource('items', ItemsController).only(['show', 'index']).apiOnly()
      router
        .resource('orders', OrdersController)
        .only(['index', 'store', 'show'])
        .use(['index', 'store', 'show'], middleware.auth())
        .apiOnly()
    })
    router
      .group(() => {
        router
          .resource('users', UsersController)
          .only(['store', 'index'])
          .apiOnly()
          .use('index', middleware.auth())
          .where('orderId', router.matchers.uuid())
        router.resource('token', TokenController).only(['store']).apiOnly()
      })
      .prefix('auth')
  })
  .prefix('api')

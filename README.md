# Description

Mini-project **shop-simple-order** is simple API presentation of online shop.
Created with [AdonisJs](https://adonisjs.com).

Check AdonisJS official [documentation](https://docs.adonisjs.com/guides/preface/introduction) to learn more about creating apps.

## Installation

```
git clone https://github.com/Cadaro/shop-simple-order.git
npm install
```

When installation packages via NPM, copy `.env.example` and name it to `.env`.
After that, generate new secure key.

```
node ace generate:key
```

## Preparing database

Migrate database to create tables in SQLite database.

```
node ace migration:run
```

Next run

```
node ace db:seed
```

to seed `items` table with example items.

## Launch development mode

To start server in development mode, run

```
npm run dev
```

## List of available routes

| Method | Route               | Auth Required | Description               |
| ------ | ------------------- | ------------- | ------------------------- |
| GET    | /api/stocks         | No            | View available stock      |
| POST   | /api/stocks         | Yes           | Create new stock item     |
| GET    | /api/stocks/:id     | No            | View one stock item       |
| GET    | /api/orders         | Yes           | View all user orders      |
| POST   | /api/orders         | Yes           | Create new order          |
| GET    | /api/orders/:id     | Yes           | View one user order       |
| GET    | /api/auth/users     | Yes           | View user data            |
| PATCH  | /api/auth/users/:id | Yes           | Update user data          |
| POST   | /api/auth/users     | No            | Create new user           |
| POST   | /api/auth/token     | No            | Create new token for user |

You can also run

```
node ace list:routes
```

to list all available routes.

## Examples

1. List all items in online-shop

```
curl --location 'localhost:3333/api/items' \
```

2. Create user account

```
curl --location 'localhost:3333/api/auth/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@exampleemail.com",
    "password": "testpassword1"
}'
```

3. Authenticate user to fetch bearer token

```
curl --location 'localhost:3333/api/auth/token' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@exampleemail.com",
    "password": "testpassword1"
}'
```

4. Create new order - authentication token is needed
   All you need to provide is itemId that you get in step 1, qty, itemPrice and currency.

```
curl --location 'localhost:3333/api/orders' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{token}}' \
--data '{
    "items": [
        {
            "itemId": "bf9fffb6-9708-46bc-a54a-2162acbc89fa",
            "qty": 2,
            "itemPrice": 9.99,
            "currency": "EUR"
        },
        {
            "itemId": "0024fb23-7fbc-4472-993d-f2e0019b0eaa",
            "qty": 1,
            "itemPrice": 7.99,
            "currency": "EUR"
        }
    ]
}'
```

5. Get all user's orders

```
curl --location 'localhost:3333/api/orders' \
--header 'Authorization: Bearer {{token}}'
```

import { test } from '@japa/runner'

test.group('Items list', () => {
  test('get a list of items in shop', async ({ client }) => {
    const response = await client.get('/items')

    response.assertStatus(200)
    // response.assertBody([
    //   {
    //     created: '22.05.2023, 19:40:45',
    //     id: '-NW3ybVwEhLcsbZgjcoh',
    //     item: {
    //       category: 'spodnie męskie',
    //       description: 'Bez zapięcia, warkoczowy splot. Długość 77 cm, rękaw 65 cm, biust 56 cm.',
    //       id: '1684784445490-sweter Yessica',
    //       image: [
    //         {
    //           imageUrl: 'https://serwer1998919.home.pl/moku/images/whitecardigan1.jpg',
    //         },
    //         {
    //           imageUrl: 'https://serwer1998919.home.pl/moku/images/whitecardigan2.jpg',
    //         },
    //       ],
    //       itemPrice: {
    //         currency: 'PLN',
    //         price: 15,
    //       },
    //       productName: 'sweter',
    //       productProperty: {
    //         brand: 'Yessica',
    //         color: 'WHITE',
    //         condition: 'bardzo dobry',
    //         size: 'L-XL/42-44',
    //       },
    //     },
    //     status: {
    //       currentStatus: 'NEW',
    //       statusDate: '2.09.2023, 15:34:59',
    //     },
    //   },
    // ])
  })
})

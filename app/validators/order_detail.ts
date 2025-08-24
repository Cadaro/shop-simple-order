import { Currency } from '#types/order';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';

export const createOrderDetailValidator = vine.compile(
  vine.object({
    items: vine
      .array(
        vine.object({
          itemId: vine.string(),
          itemName: vine.string(),
          qty: vine.number({ strict: true }).positive().withoutDecimals(),
          itemPrice: vine.number({ strict: true }).positive().decimal(2),
          currency: vine.enum(Currency),
          vatAmount: vine.number({ strict: true }).positive(),
          vatRate: vine.number({ strict: true }).positive(),
        })
      )
      .distinct('itemId')
      .notEmpty(),
  })
);

const message = {
  required: 'The {{ field }} field is required',
};

const fields = {
  'items.*.itemId': 'itemId',
  'items.*.itemName': 'itemName',
  'items.*.qty': 'qty',
  'items.*.itemPrice': 'itemPrice',
  'items.*.currency': 'currency',
  'items.*.vatAmount': 'vatAmount',
  'items.*.vatRate': 'vatRate',
};

createOrderDetailValidator.messagesProvider = new SimpleMessagesProvider(message, fields);

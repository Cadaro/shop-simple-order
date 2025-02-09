import { Currency } from '#types/order';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';

export const createOrderDetailValidator = vine.compile(
  vine.object({
    items: vine
      .array(
        vine.object({
          itemId: vine.string(),
          qty: vine.number({ strict: true }).positive().withoutDecimals(),
          itemPrice: vine.number({ strict: true }).positive().decimal(2),
          currency: vine.enum(Currency),
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
  itemId: 'itemId',
  qty: 'qty',
  itemPrice: 'itemPrice',
  currency: 'currency',
};

createOrderDetailValidator.messagesProvider = new SimpleMessagesProvider(message, fields);

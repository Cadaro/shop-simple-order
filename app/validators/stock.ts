import { Currency } from '#types/order';
import vine from '@vinejs/vine';

export const createStockValidator = vine.compile(
  vine.object({
    itemId: vine.string().optional(),
    price: vine.number({ strict: true }).positive().decimal(2).min(0.01),
    priceCurrency: vine.enum(Currency),
    name: vine.string().minLength(3).maxLength(100),
    itemDescription: vine.string().minLength(3).maxLength(4000),
    availableQty: vine.number({ strict: true }).positive().withoutDecimals(),
    photos: vine.array(
      vine.object({
        url: vine.string(),
        name: vine.string().optional(),
      })
    ),
  })
);

export const updateStockValidator = vine.compile(vine.object({}));

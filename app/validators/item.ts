import vine from '@vinejs/vine';

export const updateItemValidator = vine.compile(
  vine.object({
    itemId: vine.string().uuid({ version: [4] }),
    itemReservedQty: vine.number({ strict: true }).positive().withoutDecimals().min(1),
  })
);

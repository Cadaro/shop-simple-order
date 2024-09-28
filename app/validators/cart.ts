import vine from '@vinejs/vine';

/**
 * Validator to validate the payload when creating
 * a new cart.
 */
export const createCartValidator = vine.compile(
  vine.object({
    itemId: vine.string().uuid({ version: [4] }),
    itemName: vine.string(),
    qty: vine.number({ strict: true }).positive().withoutDecimals().min(1),
  })
);

/**
 * Validator to validate the payload when updating
 * an existing cart.
 */
export const updateCartValidator = vine.compile(
  vine.object({
    qty: vine.number({ strict: true }).positive().withoutDecimals(),
  })
);

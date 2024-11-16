import vine from '@vinejs/vine';

/**
 * Validator to validate the payload when creating
 * a new user.
 */
export const createUserValidator = vine.compile(
  vine.object({
    // firstName: vine.string().minLength(3),
    // lastName: vine.string().maxLength(254).optional(),
    email: vine.string().email().maxLength(254).trim(),
    password: vine.string(),
  })
);

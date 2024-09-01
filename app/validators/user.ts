import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new user.
 */
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().optional(),
    email: vine.string().email().maxLength(254).trim(),
    password: vine.string(),
  })
)

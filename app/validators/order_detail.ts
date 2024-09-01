import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createOrderDetailValidator = vine.compile(
  vine.object({
    data: vine
      .array(
        vine.object({
          itemId: vine.string().uuid({ version: [4] }),
          qty: vine.number({ strict: true }).positive().withoutDecimals(),
        })
      )
      .distinct('itemId')
      .notEmpty(),
  })
)

const message = {
  required: 'The {{ field }} field is required',
}

const fields = {
  itemId: 'itemId',
  qty: 'qty',
}

createOrderDetailValidator.messagesProvider = new SimpleMessagesProvider(message, fields)

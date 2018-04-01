import { MissingEffect } from '../effect'

export const Missing = {
  [MissingEffect]: (x, context) =>
    context.throw(new Error(`no handler for: ${x}`))
}

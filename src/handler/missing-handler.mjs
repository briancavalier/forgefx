import { MissingEffect } from '../effect/missing'

export const Missing = {
  [MissingEffect]: (x, context) =>
    context.throw(new Error(`no handler for: ${String(x.effect)}`))
}

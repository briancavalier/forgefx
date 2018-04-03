import { ConsoleEffect } from '../effect/console'

export const Console = {
  [ConsoleEffect]: ({ op, args }, context) =>
    context.next(console[op](...args))
}

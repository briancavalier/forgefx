import { ConsoleEffect } from '../effect'

export const Console = {
  [ConsoleEffect]: ({ op, args }, context) =>
    context.next(console[op](...args))
}

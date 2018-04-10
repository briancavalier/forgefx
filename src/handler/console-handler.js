// @flow
import { type ConsoleHandler } from '../effect/console'

export const HandleConsole: ConsoleHandler = {
  effect: 'fx/console',
  log: (args, context) =>
    context.next(console.log(...args))
}

// @flow
import { type ConsoleHandler } from '../effect/console'

export const HandleConsole: ConsoleHandler = {
  effect: 'console',
  log: (args, context) =>
    context.next(console.log(...args))
}

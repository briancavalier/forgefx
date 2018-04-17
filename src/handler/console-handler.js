// @flow
import { type ConsoleHandler } from '../effect/console'

export const HandleConsole: ConsoleHandler = {
  'fx/console/log': (args, step) => step.next(console.log(...args))
}

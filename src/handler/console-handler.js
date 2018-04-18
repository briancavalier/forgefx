// @flow
import { type ConsoleHandler } from '../effect/console'

export const HandleConsole: ConsoleHandler = {
  'forgefx/core/console/log': (args, step) => step.next(console.log(...args))
}

// @flow
import { type ConsoleHandler } from '../effect/console'
import { sync } from '../runtime'

export const HandleConsole: ConsoleHandler = {
  'forgefx/core/console/log': (args) => sync(console.log(...args))
}

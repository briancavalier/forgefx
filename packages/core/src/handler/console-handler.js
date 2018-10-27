// @flow
import { type ConsoleHandler } from '../effect/console'
import { resumeNowVoid } from '../runtime'

export const HandleConsole: ConsoleHandler = {
  'forgefx/core/console/log': args => {
    console.log(...args)
    return resumeNowVoid
  }
}

// @flow
import { type ProcessHandler } from '../effect/process'
import { sync } from '../runtime'

const hasProcess: boolean =
  typeof process === 'object' && Array.isArray(process.argv)

export const HandleProcess: ProcessHandler = {
  'forgefx/core/process/args': () =>
    sync(hasProcess ? process.argv.slice() : []),
  'forgefx/core/process/getEnv': (name) =>
    sync(hasProcess ? process.env[name] : undefined)
}

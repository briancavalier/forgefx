// @flow
import { type ProcessHandler } from '../effect/process'

const hasProcess: boolean =
  typeof process === 'object' && Array.isArray(process.argv)

export const HandleProcess: ProcessHandler = {
  'forgefx/core/process/args': (_, step) =>
    step.next(hasProcess ? process.argv.slice() : []),
  'forgefx/core/process/getEnv': (name, step) =>
    step.next(hasProcess ? process.env[name] : undefined)
}

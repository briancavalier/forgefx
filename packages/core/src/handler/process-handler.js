// @flow
import { type ProcessHandler } from '../effect/process'
import { resumeNow } from '../runtime'

const hasProcess: boolean =
  typeof process === 'object' && Array.isArray(process.argv)

export const HandleProcess: ProcessHandler = {
  'forgefx/core/process/args': () =>
    resumeNow(hasProcess ? process.argv.slice() : []),
  'forgefx/core/process/getEnv': (name) =>
    resumeNow(hasProcess ? process.env[name] : undefined)
}

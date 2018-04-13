// @flow
import { type ProcessHandler } from '../effect/process'

const hasProcessArgv: boolean =
  typeof process === 'object' && Array.isArray(process.argv)

export const HandleProcess: ProcessHandler = {
  'fx/process/args': (_, step) =>
    step.next(hasProcessArgv ? process.argv.slice() : [])
}

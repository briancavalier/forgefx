// @flow
import { type ProcessHandler } from '../effect/process'

const hasProcessArgv: boolean =
  typeof process === 'object' && Array.isArray(process.argv)

export const HandleProcess: ProcessHandler = {
  effect: 'process',
  args: (_, context) =>
    context.next(hasProcessArgv ? process.argv.slice() : [])
}

import { ProcessArgsEffect } from '../effect/process'

export const Process = {
  [ProcessArgsEffect]: (_, context) =>
    context.next(hasProcessArgv() ? process.argv.slice() : [])
}

const hasProcessArgv = () =>
  typeof process === 'object' && Array.isArray(process.argv)

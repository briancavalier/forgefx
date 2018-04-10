import { Process } from '../effect/process'

const hasProcessArgv =
  typeof process === 'object' && Array.isArray(process.argv)

export const HandleProcess = {
  effect: Process,
  args: (_, context) =>
    context.next(hasProcessArgv ? process.argv.slice() : [])
}

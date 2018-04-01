import { Context } from './context'
import { Missing } from './handler/missing-handler'

export const run = (continuation, handlers, program) =>
  new Context(continuation, {...Missing, ...handlers}, {}, program).run()

export const runPromise = (handlers, program) =>
  new Promise((resolve, reject) =>
    run({ return: resolve, throw: reject }, handlers, program))

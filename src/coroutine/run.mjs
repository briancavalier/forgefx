import { Context } from './context'
import { Missing } from '../handler/missing-handler'

export const start = context => {
  context.run()
  return context
}

export const run = (continuation, handlers, program) =>
  start(new Context(continuation, {...Missing, ...handlers}, program))

export const runPromise = (handlers, program) =>
  new Promise((resolve, reject) =>
    run({ return: resolve, throw: reject }, handlers, program))

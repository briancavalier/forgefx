import { Context, runContext } from './context'

export const run = (continuation, handlers, program) =>
  runContext(new Context(continuation, handleWith(handlers), program))

export const runPromise = (handlers, program) =>
  new Promise((resolve, reject) =>
    run({ return: resolve, throw: reject }, handlers, program))

// TODO: Decide on handler representation
// The "best" want to build up a set of handlers is unclear
// Ultimately, we need to end up with a function that
// associates an effect/operation with a function or method
// that provides the implementation.
// A good representation might have these characteristics:
// 1. Makes it simple to implement new handlers or handler alternatives
// 2. Makes it possible to create an efficient mapping from effects
//    to handlers
const handleWith = handlers => {
  const map = handlers.reduce((hs, h) => ({ ...hs, ...h }), {})
  return (e, cont) => {
    const h = map[e.effect]
    if (!h) {
      throw new Error(`no handler for: ${String(e.effect)}`)
    }

    return h(e, cont)
  }
}

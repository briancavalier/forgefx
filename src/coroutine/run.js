// @flow
import type { Action, Cancel, Cont, Step } from '../types'
import { Coroutine } from './context'

// TODO: Express constraint between H and E
// H must contain handlers for all effects in E
// Using E: { op: $Keys<H> } *almost* works.  It seems
// to express the constraint in a way that flow understands.
// Unfortunately, it also causes an odd error that I don't
// understand.  Here's an example:
// Cannot call runPromise with handlers bound to handlers because:
// • an indexer property is missing in AsyncHandler [1].
// • an indexer property is missing in ConsoleHandler [2].
export const run = <H, E, A> (continuation: Cont<A>, handlers: H, program: Action<E, A>): Cancel =>
  new Coroutine(continuation, handleWith(handlers), program).run()

export const runPromise = <H, E, A> (handlers: H, program: Action<E, A>): Promise<A> =>
  new Promise((resolve, reject) =>
    new Coroutine({ return: resolve, throw: reject }, handleWith(handlers), program).run())

// TODO: Delete or find a way to type
//
const handleWith = (handlers: any): (({ op: string, arg: any }, Step<*>) => ?Cancel) =>
  (e, step) => {
    const h = handlers[e.op]
    if (!h) {
      throw new Error(`no handler for: ${String(e.op)}`)
    }

    return h((e: any).arg, step)
  }

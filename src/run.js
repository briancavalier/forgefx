// @flow
import type { Action, Cancel, Cont } from './types'
import { runAction, createScope } from './context'

const throwOnError = {
  return: any => {},
  throw: e => { throw e }
}
// TODO: Express constraint between H and E
// H must contain handlers for all effects in E
// Using E: Effect<H> *almost* works.  It seems
// to express the constraint in a way that flow understands.
// Unfortunately, it also causes an odd error that I don't
// understand.  Here's an example:
// Cannot call runPromise with handlers bound to handlers because:
// • an indexer property is missing in AsyncHandler [1].
// • an indexer property is missing in ConsoleHandler [2].
export const run = <H, E, A> (cont: Cont<A>, handlers: H, action: Action<E, A>): Cancel =>
  runAction(cont, action, createScope(handlers))

export const run_ = <H, E, A> (handlers: H, action: Action<E, A>): Cancel =>
  run(throwOnError, handlers, action)

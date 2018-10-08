// @flow
import type { Action, Cancel, Effect, Step } from '../types'
import { type Result, uncancelable } from '../runtime'

export type AsyncF<A> = (Step<A>) => Cancel
export type NodeCB<A> = (?Error, A) => void

export type AsyncHandler = {|
  'forgefx/core/async/call': <A> (AsyncF<A>, Step<A>) => Result<A>,
  'forgefx/core/async/delay': (number, Step<void>) => Result<void>
|}

export type Async = Effect<AsyncHandler>

export function * callAsync <A> (arg: AsyncF<A>): Action<Async, A> {
  return yield { op: 'forgefx/core/async/call', arg }
}

export const callNode = <A> (nodef: NodeCB<A> => ?Cancel): Action<Async, A> =>
  callAsync(context =>
    nodef((e, x) => e ? context.throw(e) : context.next(x)) || uncancelable)

export function * delay (arg: number): Action<Async, void> {
  return yield { op: 'forgefx/core/async/delay', arg }
}

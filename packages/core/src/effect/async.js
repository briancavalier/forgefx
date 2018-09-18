// @flow
import type { Action, Cancel, Effect, Step } from '../types'
import { type Result, type Context, uncancelable } from '../runtime'

export type AsyncF<H, A> = (Context<H, A>) => Cancel
export type NodeCB<A> = (?Error, A) => void

export type AsyncHandler = {|
  'forgefx/core/async/call': <H, A> (AsyncF<H, A>, Context<H, A>) => Result<A>,
  'forgefx/core/async/delay': (number, Step<void>) => Result<void>
|}

export type Async = Effect<AsyncHandler>

export function * callAsync <H, A> (arg: AsyncF<H, A>): Action<Async, A> {
  return yield { op: 'forgefx/core/async/call', arg }
}

export const callNode = <A> (nodef: NodeCB<A> => ?Cancel): Action<Async, A> =>
  callAsync(context =>
    nodef((e, x) => e ? context.throw(e) : context.next(x)) || uncancelable)

export function * delay (arg: number): Action<Async, void> {
  return yield { op: 'forgefx/core/async/delay', arg }
}

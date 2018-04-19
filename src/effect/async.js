// @flow
import type { Action, Cancel, Effect } from '../types'
import { Context } from '../context'
import { uncancelable } from '../coroutine'

export type AsyncF<H, A> = (Context<H, A>) => Cancel
export type NodeCB<A> = (?Error, A) => void

export type AsyncHandler = {|
  'forgefx/core/async/call': <H, A> (AsyncF<H, A>, Context<H, A>) => Cancel,
  'forgefx/core/async/sleep': <H> (number, Context<H, void>) => Cancel
|}

export type Async = Effect<AsyncHandler>

export function * callAsync <H, A> (arg: AsyncF<H, A>): Action<Async, A> {
  return yield ({ op: 'forgefx/core/async/call', arg })
}

export const callNode = <A> (nodef: NodeCB<A> => ?Cancel): Action<Async, A> =>
  callAsync(context =>
    nodef((e, x) => e ? context.throw(e) : context.next(x)) || uncancelable)

export function * sleep (arg: number): Action<Async, void> {
  return yield { op: 'forgefx/core/async/sleep', arg }
}

export function * delay <A> (ms: number, a: A): Action<Async, A> {
  yield * sleep(ms)
  return a
}

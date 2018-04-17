// @flow
import type { Action, Cancel, Effect, Step } from '../types'
import { Context } from '../context'
import { uncancelable } from '../coroutine'

export type AsyncF<H, A> = (Step<A>, Context<H>) => Cancel
export type NodeCB<A> = (?Error, a: A) => void

export type AsyncHandler = {|
  'fx/async/call': <H, A> (AsyncF<H, A>, Step<A>, Context<H>) => Cancel
|}

export type Async = Effect<AsyncHandler>

export function * callAsync <H, A> (arg: AsyncF<H, A>): Action<Async, A> {
  return yield ({ op: 'fx/async/call', arg })
}

export const callNode = <A> (nodef: NodeCB<A> => ?Cancel): Action<Async, A> =>
  callAsync(step =>
    nodef((e, x) => e ? step.throw(e) : step.next(x)) || uncancelable)

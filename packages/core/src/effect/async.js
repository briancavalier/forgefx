// @flow
import type { Action, Cancel, Effect, Step } from '../types'
import type { Except } from './except'
import { call } from './core'
import { type Resume, resumeLater, uncancelable } from '../runtime'

export type AsyncF<A> = (Step<A>) => Cancel
export type NodeCB<A> = (?Error, A) => void

export type AsyncHandler = {|
  'forgefx/core/async/callAsync': <A> (AsyncF<A>) => Resume<Async, A>,
  'forgefx/core/async/delay': (number) => Resume<Async, void>
|}

export type Async = Effect<AsyncHandler>

export function * callAsync <A> (arg: AsyncF<A>): Action<Async, A> {
  return yield { op: 'forgefx/core/async/callAsync', arg }
}

export const callNode = <A> (nodef: NodeCB<A> => ?Cancel): Action<Async | Except, A> =>
  call(step =>
    nodef((e, x) => e ? step.throw(e) : step.next(x)) || uncancelable)

export function * delay (arg: number): Action<Async, void> {
  return yield { op: 'forgefx/core/async/delay', arg }
}

// @flow
import type { Action, Cancel, Effect, Step } from '../types'
import { type Result, uncancelable } from '../runtime'
import { type Context } from '../types'
import { type Either, left, right } from '../data/either'

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

export const callNode = <A> (nodef: NodeCB<A> => ?Cancel): Action<Async, Either<Error, A>> =>
  callAsync(({ next }) =>
    nodef((e, x) => next(nodeToEither(e, x))) || uncancelable)

const nodeToEither = <E, A>(e: ?E, a: A): Either<E, A> =>
  e ? left(e) : right(a)

export function * delay (arg: number): Action<Async, void> {
  return yield { op: 'forgefx/core/async/delay', arg }
}

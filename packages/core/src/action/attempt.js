// @flow
import type { Action, Cancel, Cont, Step } from '../types'
import { async, runAction, uncancelable } from '../runtime'
import { type Async, type Except, call, raise } from '../effect'
import { type Either, left, right } from '../data/either'
import { map } from './base'

export const attempt = <E, A> (a: Action<Except | E, A>): Action<E, Either<Error, A>> =>
  attemptWith(left, right, a)

export const attemptWith = <E, A, B> (f: Error => B, g: A => B, a: Action<Except | E, A>): Action<E, B> =>
  call(context => async(runAction(new AttemptWith(f, g, context), a, context.handler)))

export function* tryCatch <E, F, A> (f: Error => Action<F, A>, a: Action<Except | E, A>): Action<E | F, A> {
  const ea = yield* attempt(a)
  return ea.right ? ea.value : (yield* f(ea.value))
}

export function * alt <E, F, A> (a1: Action<Except | E, A>, a2: Action<F, A>): Action<E | F, A> {
  const ea = yield* attempt(a1)
  return ea.right ? ea.value : (yield * a2)
}

export function * ensure <E1, E2, A> (a: Action<Except | E1, A>, always: Action<E2, void>): Action<Except | E1 | E2, A> {
  const ea = yield* attempt(a)
  yield* always

  if (!ea.right) return yield* raise(ea.value)
  return ea.value
}

export function * using <E1, E2, E3, A, B> (acquire: Action<Except | E1, [Action<E3, void>, A]>, use: A => Action<Except | E2, B>): Action<Except | E1 | E2 | E3, B> {
  const ea = yield* attempt(acquire)
  if (!ea.right) return yield* raise(ea.value)

  const [release, a] = ea.value
  return yield* ensure(use(a), release)
}

export const bracket = <E1, E2, E3, A, B> (acquire: Action<Except | E1, A>, release: A => Action<E3, void>, use: A => Action<Except | E2, B>): Action<Except | E1 | E2 | E3, B> =>
  using(map(a => [release(a), a], acquire), use)

export class AttemptWith<A, B> implements Cont<A> {
  f: Error => B
  g: A => B
  step: Step<B>
  constructor (f: Error => B, g: A => B, step: Step<B>) {
    this.f = f
    this.g = g
    this.step = step
  }

  return (a: A) {
    this.step.next(this.g(a))
  }

  throw (e: Error) {
    this.step.next(this.f(e))
  }
}

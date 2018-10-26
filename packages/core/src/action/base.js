// @flow
import type { Action, Cancel, Cont, Effect, Step } from '../types'
import { StepCont, resumeLater, runAction, uncancelable } from '../runtime'
import { type Async, type Except, call, delay, raise } from '../effect'
import { type Either, left, right } from '../data/either'

export function * pure <A> (a: A): Action<empty, A> {
  return a
}

export function * map <E, A, B> (f: A => B, aa: Action<E, A>): Action<E, B> {
  return f(yield * aa)
}

export const withHandler = <H: {}, E, A> (newHandler: H, action: Action<Effect<H> | E, A>): Action<E, A> =>
  call((step, handler) => runAction(new StepCont(step), action, { ...handler, ...newHandler }))

// @flow
import type { Action, Cancel, Cont, Effect, Step } from '../types'
import { StepCont, async, runAction, uncancelable } from '../runtime'
import { type Async, type Except, call, callAsync, delay, raise } from '../effect'
import { type Either, left, right } from '../data/either'

export function * pure <A> (a: A): Action<empty, A> {
  return a
}

export function * map <E, A, B> (f: A => B, aa: Action<E, A>): Action<E, B> {
  return f(yield * aa)
}

export const withHandler = <H: {}, E, A> (handler: H, action: Action<Effect<H> | E, A>): Action<E, A> =>
  call(context => async(runAction(new StepCont(context), action, { ...context.handler, ...handler })))

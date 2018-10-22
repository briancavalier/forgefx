// @flow
import type { Action } from '../types'
import { async, runAction, uncancelable } from '../runtime'
import { type Async, type Except, call } from '../effect'
import { AttemptWith } from './attempt'

export const fromPromise = <A> (f: () => Promise<A>): Action<Async | Except, A> =>
  call(step => {
    f().then(a => step.next(a), e => step.throw(e))
    return async(uncancelable)
  })

export const toPromise = <E, A> (a: Action<Async | Except | E, A>): Action<E, Promise<A>> =>
  call(context => async(runAction(new AttemptWith(e => Promise.reject(e), a => Promise.resolve(a), context), a, context.handler)))

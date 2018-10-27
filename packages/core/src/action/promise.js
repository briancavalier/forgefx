// @flow
import type { Action } from '../types'
import { resumeLater, runAction, uncancelable } from '../runtime'
import { type Async, type Except, call } from '../effect'
import { AttemptWith } from './attempt'

export const fromPromise = <A> (f: () => Promise<A>): Action<Async | Except, A> =>
  call(step => {
    f().then(a => step.next(a), e => step.throw(e))
    return uncancelable
  })

export const toPromise = <E, A> (a: Action<Async | Except | E, A>): Action<E, Promise<A>> =>
  call((step, handler) => runAction(new AttemptWith(e => Promise.reject(e), a => Promise.resolve(a), step), a, handler))

// @flow
import type { Action, Cancel, Cont, Step } from '../types'
import { StepCont, async, runAction } from '../runtime'
import { type Async, type Except, call, delay } from '../effect'
import { type Either, left, right } from '../data/either'
import { map } from './base'

export const race = <E, A, F, B> (aa: Action<E, A>, ab: Action<F, B>): Action<E | F, Either<A, B>> =>
  call(context => async(new Race(aa, ab, context.handler, context)))

export const timeout = <E, A> (ms: number, action: Action<E | Async, A>): Action<E | Async, Either<void, A>> =>
  race(delay(ms), action)

class Race<E, F, A, B> implements Cont<Either<A, B>>, Cancel {
  step: Step<Either<A, B>>
  cancel1: Cancel
  cancel2: Cancel

  constructor (aa: Action<E, A>, ab: Action<F, B>, handler: E | F, step: Step<Either<A, B>>) {
    this.step = step
    this.cancel1 = runAction(this, map(left, aa), handler)
    this.cancel2 = runAction(this, map(right, ab), handler)
  }

  return (ab: Either<A, B>): void {
    this.cancel()
    this.step.next(ab)
  }

  throw (e: Error): void {
    this.cancel()
    this.step.throw(e)
  }

  cancel (): void {
    this.cancel1.cancel()
    this.cancel2.cancel()
  }
}

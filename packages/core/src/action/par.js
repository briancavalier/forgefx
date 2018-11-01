// @flow
import type { Action, Cancel, Cont, Step } from '../types'
import { runAction } from '../runtime'
import { call } from '../effect'
import { type Either, left, right } from '../data/either'
import { map } from './base'

export const par = <E, F, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>): Action<E | F, C> =>
  call((step, handler) => new Par(f, aa, ab, handler, step))

export const apply = <E, A, F, B> (af: Action<E, A => B>, aa: Action<F, A>): Action<E | F, B> =>
  par((f, a) => f(a), af, aa)

class Par<E, F, A, B, C> implements Cont<Either<A, B>>, Cancel {
  f: (A, B) => C
  a: ?A
  b: ?B
  remaining: number
  step: Step<C>
  cancel1: Cancel
  cancel2: Cancel

  constructor (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>, handler: E | F, step: Step<C>) {
    this.f = f
    this.a = undefined
    this.b = undefined
    this.remaining = 2
    this.step = step
    this.cancel1 = runAction(this, map(left, aa), handler)
    this.cancel2 = runAction(this, map(right, ab), handler)
  }

  return (ab: Either<A, B>): void {
    if (ab.right) this.b = ab.value
    else this.a = ab.value

    if (--this.remaining === 0) {
      const f = this.f
      this.step.next(f(((this.a: any): A), ((this.b: any): B)))
    }
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

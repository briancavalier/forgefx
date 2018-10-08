// @flow
import type { Action, Cancel, Cont, Effect, Step } from './types'
import { StepCont, async, runAction } from './runtime'
import { type Async, call, delay } from './effect'
import { type Either, left, right } from './data/either'

export const withHandler = <H: {}, E, A> (handler: H, action: Action<Effect<H> | E, A>): Action<E, A> =>
  call(context => async(runAction(new StepCont(context), action, { ...context.handler, ...handler })))

export function * map <E, A, B> (f: A => B, aa: Action<E, A>): Action<E, B> {
  return f(yield * aa)
}

export const apply = <E, A, F, B> (af: Action<E, A => B>, aa: Action<F, A>): Action<E | F, B> =>
  par((f, a) => f(a), af, aa)

export const timeout = <A> (ms: number, action: Action<Async, A>): Action<Async, Either<void, A>> =>
  race(delay(ms), action)

export const par = <E, F, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>): Action<E | F, C> =>
  call(context => async(new Par(f, aa, ab, context.handler, context)))

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

export const all = <E, A> (a: Action<E, A>[]): Action<E, A[]> =>
  traverse(a => a, a)

export const traverse = <E, A, B> (f: A => Action<E, B>, a: A[]): Action<E, B[]> =>
  call(context => async(new Traverse(f, a, context.handler, context)))

class Traverse<E, A, B> implements Step<number> {
  results: B[]
  remaining: number
  results: B[]
  cancels: Cancel[]
  step: Step<B[]>

  constructor (f: A => Action<E, B>, a: A[], handler: E, step: Step<B[]>) {
    this.step = step
    this.remaining = a.length
    this.results = Array(a.length)
    this.cancels = a.map((a, i) => runAction(new TraverseIndex(this, i), f(a), handler))
  }

  next (index: number): void {
    if (--this.remaining === 0) this.step.next(this.results)
  }

  throw (e: Error): void {
    this.cancel()
    this.step.throw(e)
  }

  cancel (): void {
    this.cancels.forEach(c => c.cancel())
  }
}

class TraverseIndex<E, A, B> implements Cont<B> {
  traverse: Traverse<E, A, B>
  index: number

  constructor (traverse: Traverse<E, A, B>, index: number) {
    this.traverse = traverse
    this.index = index
  }

  return (b: B) {
    this.traverse.results[this.index] = b
    this.traverse.next(this.index)
  }

  throw (e: Error): void {
    this.traverse.throw(e)
  }
}

export const race = <E, A, F, B> (aa: Action<E, A>, ab: Action<F, B>): Action<E | F, Either<A, B>> =>
  call(context => async(new Race(aa, ab, context.handler, context)))

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

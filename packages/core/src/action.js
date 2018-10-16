// @flow
import type { Action, Cancel, Cont, Effect, Step } from './types'
import { StepCont, async, runAction } from './runtime'
import { type Async, type Except, call, delay, raise } from './effect'
import { type Either, left, right } from './data/either'

export const recover = <F, A> (a: Action<Except | F, A>): Action<F, Either<Error, A>> =>
  call(context => async(runAction(new RecoverWith(left, right, context), a, context.handler)))

export const recoverWith = <F, A> (f: Error => A, a: Action<Except<Error> | F, A>): Action<F, A> =>
  call(context => async(runAction(new RecoverWith(f, a => a, context), a, context.handler)))

export function * alt <E, F, A> (a1: Action<Except | E, A>, a2: Action<F, A>): Action<E | F, A> {
  const ea = yield * recover(a1)
  return ea.right ? ea.value : (yield * a2)
}

class RecoverWith<A, B> implements Cont<A> {
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

export const attempt = <A, B> (f: A => B): (A => Action<Except, B>) =>
  function * (a: A): Action<Except, B> {
    try {
      return f(a)
    } catch (e) {
      return yield * raise(e)
    }
  }

export function * pure <A> (a: A): Action<empty, A> {
  return a
}

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
  call(context => async(new Traverse(f, a, insertAt, [], context.handler, context)))

export const traverse_ = <E, A, B> (f: A => Action<E, B>, a: A[]): Action<E, void> =>
  call(context => async(new Traverse(f, a, discard, undefined, context.handler, context)))

const discard = <I, A> (c: void, _: At<I, A>): void => c

const insertAt = <A> (a: A[], ia: At<number, A>): A[] => {
  a[ia.index] = ia.value
  return a
}

type At<I, A> = {
  index: I,
  value: A
}

class Traverse<E, A, B, C> implements Step<At<number, B>> {
  tally: (C, At<number, B>) => C
  result: C
  remaining: number
  cancels: Cancel[]
  step: Step<C>

  constructor (f: A => Action<E, B>, a: A[], tally: (C, At<number, B>) => C, result: C, handler: E, step: Step<C>) {
    this.tally = tally
    this.step = step
    this.result = result
    this.remaining = a.length
    this.cancels = a.map((a, i) => runAction(new TraverseAt(this, i), f(a), handler))
  }

  next (value: At<number, B>): void {
    this.result = this.tally(this.result, value)
    if (--this.remaining === 0) this.step.next(this.result)
  }

  throw (e: Error): void {
    this.cancel()
    this.step.throw(e)
  }

  cancel (): void {
    this.cancels.forEach(c => c.cancel())
  }
}

class TraverseAt<I, A> implements Cont<A> {
  step: Step<At<I, A>>
  index: I

  constructor (step: Step<At<I, A>>, index: I) {
    this.step = step
    this.index = index
  }

  return (value: A) {
    this.step.next({ index: this.index, value })
  }

  throw (e: Error): void {
    this.step.throw(e)
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

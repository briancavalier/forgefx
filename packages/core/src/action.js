// @flow
import type { Action, Cancel, Cont, Step } from './types'
import { type Scope, childScope, runAction } from './context'
import { type Async, callAsync, delay } from './effect/async'
import { type Either, left, right } from './either'

export function * map <E, A, B> (f: A => B, aa: Action<E, A>): Action<E, B> {
  return f(yield * aa)
}

export const apply = <E, A, F, B> (af: Action<E, A => B>, aa: Action<F, A>): Action<E | F, B> =>
  par((f, a) => f(a), af, aa)

export function * chain <E, A, F, B> (a: Action<E, A>, f: A => Action<F, B>): Action<E | F, B> {
  return yield * f(yield * a)
}

export const timeout = <A> (ms: number, action: Action<Async, A>): Action<Async, Either<void, A>> =>
  race(delay(ms, undefined), action)

export const par = <E, F, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>): Action<E | F, C> =>
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync(context => runPar(f, aa, ab, context, childScope(context.scope)))

const runPar = <E, F, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>, step: Step<C>, scope: Scope<E | F>): Cancel => {
  const c = new ParCont(f, step, scope)
  runAction(c, map(left, aa), scope)
  runAction(c, map(right, ab), scope)
  return scope
}

class ParCont<A, B, C> implements Cont<Either<A, B>> {
  f: (A, B) => C
  a: ?A
  b: ?B
  remaining: number
  step: Step<C>
  canceler: Cancel

  constructor (f: (A, B) => C, step: Step<C>, canceler: Cancel) {
    this.f = f
    this.a = undefined
    this.b = undefined
    this.remaining = 2
    this.step = step
    this.canceler = canceler
  }

  return (ab: Either<A, B>): void {
    if (ab.right) this.b = ab.value
    else this.a = ab.value

    if (--this.remaining === 0) {
      this.canceler.cancel()
      const f = this.f
      this.step.next(f(((this.a: any): A), ((this.b: any): B)))
    }
  }

  throw (e: Error): void {
    this.canceler.cancel()
    this.step.throw(e)
  }
}

export const race = <E, A, F, B> (aa: Action<E, A>, ab: Action<F, B>): Action<E | F, Either<A, B>> =>
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync(context => runRace(aa, ab, context, childScope(context.scope)))

const runRace = <E, F, A, B> (aa: Action<E, A>, ab: Action<F, B>, step: Step<Either<A, B>>, scope: Scope<E | F>): Cancel => {
  const c = new RaceCont(step, scope)
  runAction(c, map(left, aa), scope)
  runAction(c, map(right, ab), scope)
  return scope
}

class RaceCont<A, B> implements Cont<Either<A, B>> {
  step: Step<Either<A, B>>
  canceler: Cancel

  constructor (step: Step<Either<A, B>>, canceler: Cancel) {
    this.step = step
    this.canceler = canceler
  }

  return (ab: Either<A, B>): void {
    this.canceler.cancel()
    this.step.next(ab)
  }

  throw (e: Error): void {
    this.canceler.cancel()
    this.step.throw(e)
  }
}

type Indexed<A> = { index: number, value: A }
const index = (index: number) => <A> (value: A): Indexed<A> =>
  ({ index, value })

export const all = <E, A> (a: Action<E, A>[]): Action<E, A[]> =>
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync(context => runAll(a, context, childScope(context.scope)))

const runAll = <E, A> (a: Action<E, A>[], step: Step<A[]>, scope: Scope<E>): Cancel => {
  const c = new AllCont(new Array(a.length), step, scope)
  // FIXME: O(n) closure creation with index(i)
  a.forEach((a, i) => runAction(c, map(index(i), a), scope))
  return scope
}

class AllCont<A> implements Cont<Indexed<A>> {
  results: A[]
  remaining: number
  step: Step<A[]>
  canceler: Cancel

  constructor (results: A[], step: Step<A[]>, canceler: Cancel) {
    this.results = results
    this.remaining = results.length
    this.step = step
    this.canceler = canceler
  }

  return ({ index, value }: Indexed<A>): void {
    this.results[index] = value

    if (--this.remaining === 0) {
      this.canceler.cancel()
      this.step.next(this.results)
    }
  }

  throw (e: Error): void {
    this.canceler.cancel()
    this.step.throw(e)
  }
}

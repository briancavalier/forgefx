// @flow
import type { Action, Cancel, Cont, Effect, Step } from './types'
import { type Scope, StepCont, async, childScope, childScopeWith, runAction } from './runtime'
import { type Async, call, delay } from './effect'
import { type Either, left, right } from './data/either'

export const withHandler = <H: {}, E, A> (handler: H, action: Action<Effect<H> | E, A>): Action<E, A> =>
  call(context => async(runChild(action, context, childScopeWith(handler, context.scope))))

const runChild = <H: {}, E, A> (action: Action<Effect<H> | E, A>, step: Step<A>, scope: Scope<E>): Cancel => {
  runAction(new StepCont(step), action, scope)
  return scope
}

export function * map <E, A, B> (f: A => B, aa: Action<E, A>): Action<E, B> {
  return f(yield * aa)
}

export const apply = <E, A, F, B> (af: Action<E, A => B>, aa: Action<F, A>): Action<E | F, B> =>
  par((f, a) => f(a), af, aa)

export const timeout = <A> (ms: number, action: Action<Async, A>): Action<Async, Either<void, A>> =>
  race(delay(ms), action)

export const par = <E, F, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>): Action<E | F, C> =>
  call(context => async(runPar(f, aa, ab, context, childScope(context.scope))))

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
      const f = this.f
      this.step.next(f(((this.a: any): A), ((this.b: any): B)))
    }
  }

  throw (e: Error): void {
    this.canceler.cancel()
    this.step.throw(e)
  }
}

export const all = <E, A> (a: Action<E, A>[]): Action<E, A[]> =>
  traverse(a => a, a)

export const traverse = <E, A, B> (f: A => Action<E, B>, a: A[]): Action<E, B[]> =>
  call(context => async(runTraverse(f, a, context, childScope(context.scope))))

const runTraverse = <E, A, B> (f: A => Action<E, B>, a: A[], step: Step<B[]>, scope: Scope<E>): Cancel => {
  const state = { results: new Array(a.length), remaining: a.length }
  a.forEach((a, i) => runAction(new Traverse(state, i, step, scope), f(a), scope))
  return scope
}

type TraverseState<A> = {
  remaining: number,
  results: A[]
}

class Traverse<A> implements Cont<A> {
  state: TraverseState<A>
  index: number
  step: Step<A[]>
  canceler: Cancel

  constructor (state: TraverseState<A>, index: number, step: Step<A[]>, canceler: Cancel) {
    this.state = state
    this.index = index
    this.step = step
    this.canceler = canceler
  }

  return (a: A): void {
    this.state.results[this.index] = a
    if (--this.state.remaining === 0) this.step.next(this.state.results)
  }

  throw (e: Error): void {
    this.canceler.cancel()
    this.step.throw(e)
  }
}

export const race = <E, A, F, B> (aa: Action<E, A>, ab: Action<F, B>): Action<E | F, Either<A, B>> =>
  call(context => async(runRace(aa, ab, context, childScope(context.scope))))

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

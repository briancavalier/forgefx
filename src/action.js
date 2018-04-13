// @flow
import type { Action, Cancel, Cont, Step } from './types'
import { type Context, childContext, runAction } from './context'
import { callAsync } from './effect/async'
import { type Either, either, left, right } from './either'

export function * map <E, A, B> (f: A => B, aa: Action<E, A>): Action<E, B> {
  return f(yield * aa)
}

export const apply = <E, A, F, B> (af: Action<E, A => B>, aa: Action<F, A>): Action<E | F, B> =>
  par((f, a) => f(a), af, aa)

export function * chain <E, A, F, B> (a: Action<E, A>, f: A => Action<F, B>): Action<E | F, B> {
  return yield * f(yield * a)
}

// TODO: Ensure context/cancelation are handled well here
// e.g. par(f, a, par(g, b, c)) should compose in a way that
// will cancel the outer par if the inner fails

export const par = <E, F, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>): Action<E | F, C> =>
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync((step, context) => runPar(f, aa, ab, step, childContext(context)))

const runPar = <E, F, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>, step: Step<C>, context: Context<E | F>): Cancel => {
  const c = new ParCont(f, step, context)
  runAction(c, map(left, aa), context)
  runAction(c, map(right, ab), context)
  return context
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
  raceWith(left, right, aa, ab)

export const raceWith = <E, A, F, B, C> (ac: A => C, bc: B => C, aa: Action<E, A>, ab: Action<F, B>): Action<E | F, C> =>
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync((step, context) => runRace(ac, bc, aa, ab, step, childContext(context)))

const runRace = <E, F, A, B, C> (ac: A => C, bc: B => C, aa: Action<E, A>, ab: Action<F, B>, step: Step<C>, context: Context<E | F>): Cancel => {
  const c = new RaceCont(ac, bc, step, context)
  runAction(c, map(left, aa), context)
  runAction(c, map(right, ab), context)
  return context
}

class RaceCont<A, B, C> implements Cont<Either<A, B>> {
  ac: A => C
  bc: B => C
  step: Step<C>
  canceler: Cancel

  constructor (ac: A => C, bc: B => C, step: Step<C>, canceler: Cancel) {
    this.ac = ac
    this.bc = bc
    this.step = step
    this.canceler = canceler
  }

  return (ab: Either<A, B>): void {
    this.canceler.cancel()
    this.step.next(either(this.ac, this.bc, ab))
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
  callAsync((step, context) => runAll(a, step, childContext(context)))

const runAll = <E, A> (a: Action<E, A>[], step: Step<A[]>, context: Context<E>): Cancel => {
  const c = new AllCont(new Array(a.length), step, context)
  // FIXME: O(n) closure creation with index(i)
  a.forEach((a, i) => runAction(c, map(index(i), a), context))
  return context
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

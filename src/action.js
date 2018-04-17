// @flow
import type { Action, Cancel, Cont, Step } from './types'
import { type Context, childContext, runAction } from './context'
import { type Async, callAsync } from './effect/async'
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
  race(delay(ms), action)

// TODO: Implement as effect+handler so timers can be
// abstracted. e.g. fx/timer.
export const delay = <A> (ms: number, a: A): Action<Async, A> =>
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync(performDelay(ms, a))

const performDelay = <A> (ms: number, x: A) => (step: Step<A>): Cancel =>
  new CancelTimer(setTimeout(onTimer, ms, x, step))

const onTimer = <A> (x: A, step: Step<A>): void => step.next(x)

class CancelTimer implements Cancel {
  timer: any
  constructor (timer: any) {
    this.timer = timer
  }

  cancel (): void {
    clearTimeout(this.timer)
  }
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
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync((step, context) => runRace(aa, ab, step, childContext(context)))

const runRace = <E, F, A, B> (aa: Action<E, A>, ab: Action<F, B>, step: Step<Either<A, B>>, context: Context<E | F>): Cancel => {
  const c = new RaceCont(step, context)
  runAction(c, map(left, aa), context)
  runAction(c, map(right, ab), context)
  return context
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

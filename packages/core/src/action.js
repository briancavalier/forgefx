// @flow
import type { Action, Cancel, Effect, Step } from './types'
import { async, runAction, cancelBoth, cancelAll } from './runtime'
import { type Async, call, delay } from './effect'
import { type Either, left, right } from './data/either'

export function * map <E, A, B> (f: A => B, aa: Action<E, A>): Action<E, B> {
  return f(yield * aa)
}

export const apply = <E, A, B> (af: Action<E, A => B>, aa: Action<E, A>): Action<E, B> =>
  par((f, a) => f(a), af, aa)

export const withHandler = <H: {}, E, A> (handler: H, action: Action<Effect<H> | E, A>): Action<E, A> =>
  call(context => async(runAction(context.next, action, { ...context.handler, ...handler })))

export const timeout = <A> (ms: number, action: Action<Async, A>): Action<Async, Either<void, A>> =>
  race(delay(ms), action)

export const par = <E, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<E, B>): Action<E, C> =>
  map(([a, b]) => f((a.value: any), (b.value: any)), all([map(left, aa), map(right, ab)]))

export const all = <E, A> (action: Action<E, A>[]): Action<E, Either<Error, A[]>> =>
  traverse(right, action)

export const traverse = <E, A, B> (f: A => Either<Error, B>, a: Action<E, A>[]): Action<E, Either<Error, B[]>> =>
  call(context => async(runTraverse(f, a, context.next, context.handler)))

const runTraverse = <E, A, B> (f: A => Either<Error, B>, a: Action<E, A>[], step: Step<Either<Error, B[]>>, handler: E): Cancel => {
  let remaining = a.length
  let results = Array(remaining)
  const cancels = a.map((action, i) => runAction(a => {
    const eb = f(a)
    if (!eb.right) {
      cancel()
      return step(eb)
    }

    results[i] = eb.value
    if (--remaining === 0) step(right(results))
  }, action, handler))
  const cancel = cancelAll(cancels)
  return cancel
}

export const race = <E, A, F, B> (aa: Action<E, A>, ab: Action<F, B>): Action<E | F, Either<A, B>> =>
  call(context => async(runRace(aa, ab, context.next, context.handler)))

const runRace = <E, F, A, B> (aa: Action<E, A>, ab: Action<F, B>, step: Step<Either<A, B>>, handler: E | F): Cancel => {
  const c = ab => {
    ab.right ? c1() : c2()
    step(ab)
  }
  const c1 = runAction(c, map(left, aa), handler)
  const c2 = runAction(c, map(right, ab), handler)
  const cancel = cancelBoth(c1, c2)
  return cancel
}

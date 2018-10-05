// @flow
import type { Action, Cancel, Effect, Step } from './types'
import { async, runAction, cancelBoth, cancelAll } from './runtime'
import { type Async, call, callAsync, delay } from './effect'
import { type Either, left, right } from './data/either'

export function * map <E, A, B> (f: A => B, aa: Action<E, A>): Action<E, B> {
  return f(yield * aa)
}

export const apply = <E, A, F, B> (af: Action<E, A => B>, aa: Action<F, A>): Action<E | F, B> =>
  par((f, a) => f(a), af, aa)

export const withHandler = <H: {}, E, A> (handler: H, action: Action<Effect<H> | E, A>): Action<E, A> =>
  call(context => async(runChild(action, context, { ...context.handler, ...handler })))

const runChild = <H: {}, E, A> (action: Action<Effect<H> | E, A>, step: Step<A>, handler: H): Cancel =>
  runAction(eea =>
    eea.right ? step.next(eea.value) : step.throw(eea.value)
  , action, handler)

export const timeout = <A> (ms: number, action: Action<Async, A>): Action<Async, Either<void, A>> =>
  race(delay(ms), action)

export const par = <E, F, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>): Action<E | F, C> =>
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync(context => runPar(f, aa, ab, context, context.handler))

const runPar = <E, F, A, B, C> (f: (A, B) => C, aa: Action<E, A>, ab: Action<F, B>, step: Step<C>, handler: E | F): Cancel => {
  let a: ?A
  let b: ?B
  let remaining = 2
  const c = eeab => {
    if (!eeab.right) {
      cancel()
      return step.throw(eeab.value)
    }

    const ab = eeab.value
    if (ab.right) b = ab.value
    else a = ab.value

    if (--remaining === 0) {
      cancel()
      step.next(f(((a: any): A), ((b: any): B)))
    }
  }
  const c1 = runAction(c, map(left, aa), handler)
  const c2 = runAction(c, map(right, ab), handler)
  const cancel = cancelBoth(c1, c2)
  return cancel
}

export const race = <E, A, F, B> (aa: Action<E, A>, ab: Action<F, B>): Action<E | F, Either<A, B>> =>
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync(context => runRace(aa, ab, context, context.handler))

const runRace = <E, F, A, B> (aa: Action<E, A>, ab: Action<F, B>, step: Step<Either<A, B>>, handler: E | F): Cancel => {
  const c = eeab => {
    cancel()
    eeab.right ? step.next(eeab.value) : step.throw(eeab.value)
  }
  const c1 = runAction(c, map(left, aa), handler)
  const c2 = runAction(c, map(right, ab), handler)
  const cancel = cancelBoth(c1, c2)
  return cancel
}

export const all = <E, A> (a: Action<E, A>[]): Action<E, A[]> =>
  // $FlowFixMe Why doesn't flow like the type here?
  callAsync(context => runAll(a, context, context.handler))

const runAll = <E, A> (a: Action<E, A>[], step: Step<A[]>, handler: E): Cancel => {
  let remaining = a.length
  let results = Array(remaining)
  const cancels = a.map((action, i) => runAction(ea => {
    if (!ea.right) {
      cancel()
      return step.throw(ea.value)
    }

    results[i] = ea.value

    if (--remaining === 0) {
      cancel()
      step.next(results)
    }
  }, action, handler))
  const cancel = cancelAll(cancels)
  return cancel
}

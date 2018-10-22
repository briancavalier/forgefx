// @flow
import type { Action, Cancel, Cont, Step } from '../types'
import { StepCont, async, runAction } from '../runtime'
import { type Async, type Except, call } from '../effect'

export const traverse = <E, A, B> (f: A => Action<E, B>, a: A[]): Action<E, B[]> =>
  call(context => async(new Traverse(f, a, insertAt, [], context.handler, context)))

export const traverse_ = <E, A, B> (f: A => Action<E, B>, a: A[]): Action<E, void> =>
  call(context => async(new Traverse(f, a, discard, undefined, context.handler, context)))

export const all = <E, A> (a: Action<E, A>[]): Action<E, A[]> =>
  traverse(a => a, a)

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
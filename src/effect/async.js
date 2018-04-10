// @flow
import type { Action, Cancel, Cont, Context, MakeEffect, Named, Step } from '../types'
import { childContext, runContext, uncancelable } from '../coroutine/context'

export type AsyncF<A> = Step<A> => Cancel
export type NodeCB<A> = (?Error, a: A) => void

export interface AsyncHandler extends Named<'fx/async'> {
  call <A> (AsyncF<A>, Step<A>): Cancel
}

export type Async = MakeEffect<AsyncHandler>

export function * callAsync <A> (arg: AsyncF<A>): Action<Async, A> {
  return yield ({ effect: 'fx/async', op: 'call', arg })
}

export const callNode = <A> (nodef: NodeCB<A> => ?Cancel): Action<Async, A> =>
  callAsync(context =>
    nodef((e, x) => e ? context.throw(e) : context.next(x)) || uncancelable)

// TODO: Implement as effect+handler so timers can be
// abstracted. e.g. fx/timer.
// FIXME: Why doesn't flow like the type of performDelay here?
export const delay = <A> (ms: number, a: A): Action<Async, A> =>
  callAsync((performDelay(ms, a): any))

const performDelay = <A> (ms: number, x: A) => (step: Step<A>): Cancel =>
  new CancelTimer(setTimeout(onTimer, ms, x, step))

const onTimer = <A> (x: A, step: Step<A>): void => step.next(x)

class CancelTimer implements Cancel {
  timer: TimeoutID
  constructor (timer: TimeoutID) {
    this.timer = timer
  }

  cancel (): void {
    clearTimeout(this.timer)
  }
}

export const timeout = <A> (ms: number, a: A, action: Action<Async, A>): Action<Async, A> =>
  first([delay(ms, a), action])

// FIXME: Why doesn't flow like the type of runAll here?
export const all = <A> (actions: Action<Async, A>[]): Action<Async, A[]> =>
  callAsync((runAll(actions): any))

const cancel = c => c.cancel()

const runAll = <A> (actions: Action<Async, A>[]) => (context: Step<A[]>): Cancel =>
  new AllContinuation(actions, context)

class IndexContinuation<A> implements Cont<A> {
  index: number
  results: A[]
  continuation: Cont<number>

  constructor (index: number, results: A[], continuation: Cont<number>) {
    this.index = index
    this.results = results
    this.continuation = continuation
  }

  return (a: A): void {
    this.results[this.index] = a
    this.continuation.return(this.index)
  }

  throw (e: Error): void {
    this.continuation.throw(e)
  }
}

class AllContinuation<A> implements Cont<number>, Cancel {
  results: A[]
  remaining: number
  context: Step<A[]>
  children: Cancel[]

  constructor (actions: Action<Async, A>[], context: Step<A[]>) {
    this.context = context
    this.remaining = actions.length
    this.results = Array(actions.length)
    this.children = actions.map((p, i) =>
      runContext(childContext(new IndexContinuation(i, this.results, this), p, this.context)))
  }

  return (index: number): void {
    if (--this.remaining === 0) this.context.next(this.results)
  }

  throw (e: Error): void {
    if (this.remaining === 0) return

    this.remaining = 0
    this.cancel()
    this.context.throw(e)
  }

  cancel (): void {
    this.children.forEach(cancel)
  }
}

// FIXME: Why doesn't flow like the type of runFirst here?
export const first = <A> (actions: Action<Async, A>[]): Action<Async, A> =>
  callAsync((runFirst(actions): any))

const runFirst = <A> (actions: Action<Async, A>[]) => (context: Step<A>): Cancel =>
  new FirstContinuation(actions, context)

class FirstContinuation<A> implements Cont<A> {
  done: boolean
  context: Step<A>
  children: Cancel[]

  constructor (actions: Action<Async, A>[], context: Step<A>) {
    this.context = context
    this.done = false
    this.children = actions.map((p, i) => runContext(childContext(this, p, this.context)))
  }

  return (a: A): void {
    if (!this.done) this._complete(this.context.next, a)
  }

  throw (e: Error): void {
    if (!this.done) this._complete(this.context.throw, e)
  }

  _complete <B> (step: B => void, b: B) {
    this.done = true
    this.cancel()
    step.call(this.context, b)
  }

  cancel (): void {
    this.children.forEach(cancel)
  }
}

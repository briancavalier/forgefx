// @flow
import type { Action, Cancel, Effect, Step } from '../types'
import { Context } from '../context'
import { uncancelable } from '../coroutine'
import { race } from '../action'
import { type Either } from '../either'

export type AsyncF<H, A> = (Step<A>, Context<H>) => Cancel
export type NodeCB<A> = (?Error, a: A) => void

export type AsyncHandler = {|
  'fx/async/call': <H, A> (AsyncF<H, A>, Step<A>, Context<H>) => Cancel
|}

export type Async = Effect<AsyncHandler>

export function * callAsync <H, A> (arg: AsyncF<H, A>): Action<Async, A> {
  return yield ({ op: 'fx/async/call', arg })
}

export const callNode = <A> (nodef: NodeCB<A> => ?Cancel): Action<Async, A> =>
  callAsync(step =>
    nodef((e, x) => e ? step.throw(e) : step.next(x)) || uncancelable)

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

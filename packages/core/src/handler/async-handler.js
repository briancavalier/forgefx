// @flow
import type { Cancel, Step } from '../types'
import type { AsyncF, AsyncHandler, Delay } from '../effect/async'
import type { Context } from '../context'

export const HandleAsync: AsyncHandler = {
  'forgefx/core/async/call': <H, A> (f: AsyncF<H, A>, context: Context<H, A>) =>
    callAsync(f, context),
  'forgefx/core/async/delay': <H, A> ({ ms, value }: Delay<A>, context: Context<H, A>) =>
    performDelay(ms, value, context)
}

const callAsync = <H, A> (f: AsyncF<H, A>, context: Context<H, A>) =>
  f(context)

const performDelay = <A> (ms: number, value: A, step: Step<A>): Cancel =>
  new CancelTimer(setTimeout(onTimer, ms, value, step))

const onTimer = <A> (value: A, step: Step<A>): void =>
  step.next(value)

class CancelTimer implements Cancel {
  timer: any
  constructor (timer: any) {
    this.timer = timer
  }

  cancel (): void {
    clearTimeout(this.timer)
  }
}

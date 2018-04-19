// @flow
import type { Cancel, Step } from '../types'
import type { AsyncF, AsyncHandler } from '../effect/async'
import type { Context } from '../context'

export const HandleAsync: AsyncHandler = {
  'forgefx/core/async/call': <H, A> (f: AsyncF<H, A>, context: Context<H, A>) =>
    callAsync(f, context),
  'forgefx/core/async/sleep': <H> (ms: number, context: Context<H, void>) =>
    callAsync(performDelay(ms), context)
}

const callAsync = <H, A> (f: AsyncF<H, A>, context: Context<H, A>) =>
  f(context)

const performDelay = (ms: number) => (step: Step<void>): Cancel =>
  new CancelTimer(setTimeout(onTimer, ms, step))

const onTimer = (step: Step<void>): void => step.next()

class CancelTimer implements Cancel {
  timer: any
  constructor (timer: any) {
    this.timer = timer
  }

  cancel (): void {
    clearTimeout(this.timer)
  }
}

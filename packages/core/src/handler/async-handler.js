// @flow
import type { Cancel, Step } from '../types'
import type { AsyncF, AsyncHandler } from '../effect/async'
import { type Result, async } from '../runtime'

export const HandleAsync: AsyncHandler = {
  'forgefx/core/async/call': <A> (f: AsyncF<A>, step: Step<A>): Result<A> =>
    async(f(step)),
  'forgefx/core/async/delay': (ms: number, step: Step<void>): Result<void> =>
    async(new CancelTimer(setTimeout(onTimer, ms, step)))
}

const onTimer = (step: Step<void>): void =>
  step.next(undefined)

class CancelTimer implements Cancel {
  timer: any
  constructor (timer: any) {
    this.timer = timer
  }

  cancel (): void {
    clearTimeout(this.timer)
  }
}

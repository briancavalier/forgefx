// @flow
import type { Cancel, Step } from '../types'
import type { Async, AsyncF, AsyncHandler } from '../effect/async'
import { type Resume, resumeLater } from '../runtime'

export const HandleAsync: AsyncHandler = {
  'forgefx/core/async/callAsync': <A> (f: AsyncF<A>): Resume<Async, A> =>
    resumeLater(f),
  'forgefx/core/async/delay': (ms: number): Resume<Async, void> =>
    resumeLater(step => new CancelTimer(setTimeout(onTimer, ms, step)))
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

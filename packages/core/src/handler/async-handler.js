// @flow
import type { Cancel, Step } from '../types'
import type { AsyncF, AsyncHandler } from '../effect/async'
import { type Result, async } from '../runtime'
import { type Context } from '../types'

export const HandleAsync: AsyncHandler = {
  'forgefx/core/async/call': <H, A> (f: AsyncF<H, A>, context: Context<H, A>): Result<A> =>
    async(f(context)),
  'forgefx/core/async/delay': (ms: number, step: Step<void>): Result<void> =>
    async(cancelTimer(setTimeout(onTimer, ms, step)))
}

const onTimer = (step: Step<void>): void =>
  step.next(undefined)

const cancelTimer = (timer: any): Cancel =>
  () => clearTimeout(timer)

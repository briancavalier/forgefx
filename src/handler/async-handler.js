// @flow
import type { Step } from '../types'
import type { AsyncF, AsyncHandler } from '../effect/async'
import { Context } from '../context'

export const HandleAsync: AsyncHandler = {
  'fx/async/call': <H, A> (f: AsyncF<H, A>, step: Step<A>, context: Context<H>) => f(step, context)
}

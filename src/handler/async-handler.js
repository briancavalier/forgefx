// @flow
import { type Step } from '../types'
import { type AsyncF, type AsyncHandler } from '../effect/async'

export const HandleAsync: AsyncHandler = {
  effect: 'fx/async',
  call: <A> (f: AsyncF<A>, context: Step<A>) => f(context)
}

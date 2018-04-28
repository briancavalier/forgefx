// @flow
import type { CoreHandler } from '../effect/core'
import type { Step } from '../types'

export const HandleCore: CoreHandler = {
  'forgefx/core/handle': <A, R, B> (a: { handler: (A, Step<B>) => R, arg: A }, step: Step<B>): R =>
    a.handler(a.arg, step)
}

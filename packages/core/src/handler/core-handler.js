// @flow
import type { CoreHandler, ContextF } from '../effect/core'
import { type Result } from '../runtime'
import { type Context } from '../types'

export const HandleCore: CoreHandler = {
  'forgefx/core/call': <H, A> (f: ContextF<H, A>, context: Context<H, A>): Result<A> =>
    f(context)
}

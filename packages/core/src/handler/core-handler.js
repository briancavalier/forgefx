// @flow
import type { CoreHandler, ContextF } from '../effect/core'
import { type Context, type Result } from '../runtime'

export const HandleCore: CoreHandler = {
  'forgefx/core/call': <H, A> (f: ContextF<H, A>, context: Context<H, A>): Result<A> =>
    f(context)
}

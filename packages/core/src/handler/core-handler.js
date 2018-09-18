// @flow
import type { CoreHandler, ContextF } from '../effect/core'
import { type Context, type Result, async } from '../runtime'

export const HandleCore: CoreHandler = {
  'forgefx/core/call': <H, A> (f: ContextF<H, A>, context: Context<H, A>): Result<A> =>
    callWithContext(f, context)
}

const callWithContext = <H, A> (f: ContextF<H, A>, context: Context<H, A>): Result<A> =>
  async(f(context))

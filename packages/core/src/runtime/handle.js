// @flow
import type { Context, Op } from '../types'
import { type Result } from './result'

export const handleEffect = <H, E, A> (op: Op<E>, context: Context<H, A>): Result<A> => {
  const h = (context.handler: any)[op.op]
  if (!h) throw new Error(`Unhandled effect: ${String(op)}`)

  return h((op: any).arg, context)
}

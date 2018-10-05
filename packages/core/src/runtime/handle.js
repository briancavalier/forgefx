// @flow
import type { Context } from './context'
import { type Result } from './result'

export const handleEffect = <H, A> ({ op, arg }: any, context: Context<H, A>): Result<A> => {
  const h = (context.handler: any)[op]
  if (!h) throw new Error(`Unhandled effect: ${String(op)}`)

  return h(arg, context)
}

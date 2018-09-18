// @flow
import type { Action, Cancel } from '../types'
import { type Context, type Result } from '../runtime'

export type ContextF<H, A> = (Context<H, A>) => Cancel

export type CoreHandler = {|
  'forgefx/core/call': <H, A> (ContextF<H, A>, Context<H, A>) => Result<A>,
|}

export function * call <H, E, A> (arg: ContextF<H, A>): Action<E, A> {
  return yield ({ op: 'forgefx/core/call', arg }: any)
}

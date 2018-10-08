// @flow
import { type Action, type Context } from '../types'
import { type Result } from '../runtime'

export type ContextF<H, A> = (Context<H, A>) => Result<A>

export type CoreHandler = {|
  'forgefx/core/call': <H, A> (ContextF<H, A>, Context<H, A>) => Result<A>,
|}

export function * call <H, E, A> (arg: ContextF<H, A>): Action<E, A> {
  return yield ({ op: 'forgefx/core/call', arg }: any)
}

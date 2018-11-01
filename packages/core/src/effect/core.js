// @flow
import { type Action, type Step, type Cancel } from '../types'
import { type Resume } from '../runtime'

export type ResumeF<H, A> = (Step<A>, H) => Cancel

export type CoreHandler = {|
  'forgefx/core/suspend': <H, A> (Resume<H, A>) => Resume<H, A>,
  'forgefx/core/call': <H, A> (ResumeF<H, A>) => Resume<H, A>,
|}

export function * suspend <H, E, A> (arg: Resume<H, A>): Action<E, A> {
  return yield ({ op: 'forgefx/core/suspend', arg }: any)
}

export function * call <H, E, A> (arg: ResumeF<H, A>): Action<E, A> {
  return yield ({ op: 'forgefx/core/call', arg }: any)
}

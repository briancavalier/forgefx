// @flow
import type { Action, Effect } from '../types'

export type Except = Effect<{ 'forgefx/core/except': empty }>

export function * raise <E: Error, A> (e: E): Action<Except, A> {
  throw e
}

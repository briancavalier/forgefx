// @flow
import type { Action, Effect, Step } from '../types'
import type { Resume } from '../runtime'

export type TimeHandler = {|
  'forgefx/core/time/now': () => Resume<Time, number>
|}

export type Time = Effect<TimeHandler>

export function * time (): Action<Time, number> {
  return yield { op: 'forgefx/core/time/now' }
}

export function * date (): Action<Time, Date> {
  return new Date(yield * time())
}

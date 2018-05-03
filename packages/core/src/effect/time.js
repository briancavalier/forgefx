// @flow
import type { Action, Effect, Step } from '../types'
import type { Result } from '../runtime'

export type TimeHandler = {|
  'forgefx/core/time/now': (void, Step<number>) => Result<number>
|}

export type Time = Effect<TimeHandler>

export function * now (): Action<Time, number> {
  return yield { op: 'forgefx/core/time/now' }
}

export function * date (): Action<Time, Date> {
  return new Date(yield * now())
}

// @flow
import type { Action, Effect, Step } from '../types'
import type { Result } from '../result'

export type RandomHandler = {|
  'forgefx/core/random': (void, Step<number>) => Result<number>
|}

export type Random = Effect<RandomHandler>

export function * random (): Action<Random, number> {
  return yield { op: 'forgefx/core/random' }
}

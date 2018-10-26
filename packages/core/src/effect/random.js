// @flow
import type { Action, Effect, Step } from '../types'
import type { Resume } from '../runtime'

export type RandomHandler = {|
  'forgefx/core/random': (void, Step<number>) => Resume<Random, number>
|}

export type Random = Effect<RandomHandler>

export function * random (): Action<Random, number> {
  return yield { op: 'forgefx/core/random' }
}

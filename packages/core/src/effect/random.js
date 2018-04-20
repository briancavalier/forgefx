// @flow
import type { Action, Effect, Step } from '../types'

export type RandomHandler = {|
  'forgefx/core/random': (void, Step<number>) => void
|}

export type Random = Effect<RandomHandler>

export function * random (): Action<Random, number> {
  return yield { op: 'forgefx/core/random' }
}

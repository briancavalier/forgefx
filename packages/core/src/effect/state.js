// @flow
import type { Action, Effect, Step } from '../types'
import type { Result } from '../runtime'

export type StateHandler<S> = {|
  'forgefx/core/state/get': (void, Step<S>) => Result<S>,
  'forgefx/core/state/set': (S, Step<void>) => Result<void>,
  'forgefx/core/state/update': (S => S, Step<void>) => Result<void>
|}

export type State<S> = Effect<StateHandler<S>>

export function * get <S> (): Action<State<S>, S> {
  return yield { op: 'forgefx/core/state/get' }
}

export function * set <S> (arg: S): Action<State<S>, void> {
  return yield { op: 'forgefx/core/state/set', arg }
}

export function * update <S> (arg: S => S): Action<State<S>, S> {
  return yield { op: 'forgefx/core/state/update', arg }
}

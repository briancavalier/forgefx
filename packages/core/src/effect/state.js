// @flow
import type { Action, Effect, Step } from '../types'

export type ReaderHandler<S> = {
  'forgefx/core/state/get': (void, Step<S>) => void
}

export type WriterHandler<S> = {
  'forgefx/core/state/set': (S, Step<void>) => void
}

export type UpdateHandler<S> = {
  'forgefx/core/state/update': (S => S, Step<S>) => void
}

export type StateHandler<S> = {
  ...ReaderHandler<S>,
  ...WriterHandler<S>,
  ...UpdateHandler<S>
}

export type Reader<S> = Effect<ReaderHandler<S>>
export type Writer<S> = Effect<WriterHandler<S>>
export type Update<S> = Effect<UpdateHandler<S>>

export type State<S> = Reader<S> | Writer<S> | Update<S>

export function * get <S> (): Action<State<S>, S> {
  return yield { op: 'forgefx/core/state/get' }
}

export function * set <S> (arg: S): Action<State<S>, void> {
  return yield { op: 'forgefx/core/state/set', arg }
}

export function * update <S> (arg: S => S): Action<State<S>, S> {
  return yield { op: 'forgefx/core/state/update', arg }
}

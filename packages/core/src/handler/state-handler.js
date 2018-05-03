// @flow
import type { Action } from '../types'
import type { State, ReaderHandler, WriterHandler, StateHandler } from '../effect/state'
import { handle } from '../effect/core'
import { sync } from '../runtime'

export type StateVar<S> = { value: S }

export const HandleReader = <S> (s: StateVar<S>): ReaderHandler<S> => ({
  'forgefx/core/state/get': () => sync(s.value)
})

export const HandleWriter = <S> (s: StateVar<S>): WriterHandler<S> => ({
  'forgefx/core/state/set': (s1) => {
    s.value = s1
    return sync()
  }
})

export const HandleState = <S> (s: StateVar<S>): StateHandler<S> => ({
  ...HandleReader(s),
  ...HandleWriter(s),
  'forgefx/core/state/update': (update) => {
    const s0 = s.value
    s.value = update(s0)
    return sync(s0)
  }
})

export const withState = <S, E, A> (s: S, action: Action<State<S> | E, A>): Action<E, A> =>
  handle(HandleState({ value: s }), action)

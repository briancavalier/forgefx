// @flow
import type { StateHandler } from '../effect/state'
import { sync } from '../runtime'

export const HandleState = <S> (s: S): StateHandler<S> => ({
  'forgefx/core/state/get': () => sync(s),
  'forgefx/core/state/set': s1 => {
    s = s1
    return sync()
  },
  'forgefx/core/state/update': update => {
    s = update(s)
    return sync()
  }
})

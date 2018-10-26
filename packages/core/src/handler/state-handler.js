// @flow
import type { StateHandler } from '../effect/state'
import { resumeNow, resumeNowVoid } from '../runtime'

export const HandleState = <S> (s: S): StateHandler<S> => ({
  'forgefx/core/state/get': () => resumeNow(s),
  'forgefx/core/state/set': s1 => {
    s = s1
    return resumeNowVoid
  },
  'forgefx/core/state/update': update => {
    s = update(s)
    return resumeNowVoid
  }
})

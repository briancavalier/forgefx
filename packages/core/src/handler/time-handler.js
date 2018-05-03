// @flow
import { type TimeHandler } from '../effect/time'
import { sync } from '../runtime'

export const HandleTime: TimeHandler = {
  'forgefx/core/time/now': () => sync(Date.now())
}

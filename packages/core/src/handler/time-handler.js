// @flow
import { type TimeHandler } from '../effect/time'
import { sync } from '../result'

export const HandleTime: TimeHandler = {
  'forgefx/core/time/now': () => sync(Date.now())
}

// @flow
import { type TimeHandler } from '../effect/time'

export const HandleTime: TimeHandler = {
  'forgefx/core/time/now': (_, step) => step.next(Date.now())
}

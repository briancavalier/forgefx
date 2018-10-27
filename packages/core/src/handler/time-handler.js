// @flow
import { type TimeHandler } from '../effect/time'
import { resumeNow } from '../runtime'

export const HandleTime: TimeHandler = {
  'forgefx/core/time/now': () => resumeNow(Date.now())
}

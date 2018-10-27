// @flow
import { type RandomHandler } from '../effect/random'
import { resumeNow } from '../runtime'

export const HandleRandom: RandomHandler = {
  'forgefx/core/random': () => resumeNow(Math.random())
}

// @flow
import { type RandomHandler } from '../effect/random'
import { sync } from '../result'

export const HandleRandom: RandomHandler = {
  'forgefx/core/random': () => sync(Math.random())
}

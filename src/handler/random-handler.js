// @flow
import { type RandomHandler } from '../effect/random'

export const HandleRandom: RandomHandler = {
  'forgefx/core/random': (_, step) => step.next(Math.random())
}

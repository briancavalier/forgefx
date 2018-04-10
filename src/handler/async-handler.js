import { Async } from '../effect/async'

export const HandleAsync = {
  effect: Async,
  call: ({ f }, context) => f(context)
}

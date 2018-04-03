import { AsyncEffect } from '../effect/async'

export const Async = {
  [AsyncEffect]: ({ f }, context) => f(context)
}

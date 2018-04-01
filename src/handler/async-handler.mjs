import { AsyncEffect } from '../effect'

export const Async = {
  [AsyncEffect]: ({ f }, context) => f(context)
}

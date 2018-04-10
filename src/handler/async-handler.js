import { type AsyncHandler } from '../effect/async'

export const HandleAsync: AsyncHandler = {
  effect: 'async',
  call: (f, context) => f(context)
}

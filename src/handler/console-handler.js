import { Console } from '../effect/console'

export const HandleConsole = {
  effect: Console,
  log: ({ args }, context) =>
    context.next(console.log(...args))
}

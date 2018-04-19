// @flow
import { type Cancel, type ConsoleHandler, type Step, run } from '../..'
import { type ReadlineHandler } from './readline-effect'
import { main } from './main'

// Let's create a ReadlineHandler that "reads" from a
// provided list of strings, rather than reading user input
// from stdin.
const TestHandleReadline = (messages: string[]): ReadlineHandler => ({
  'forgefx/readline/prompt': (prompt: string, step: Step<void>): void =>
    step.next(),
  'forgefx/readline/read': (_: void, step: Step<string>): Cancel => {
    const t = setTimeout((msg, step) => step.next(msg), 0, messages.shift(), step)
    return { cancel () { clearTimeout(t) } }
  },
  'forgefx/readline/close': (_: void, step: Step<void>): void =>
    step.next()
})

// And let's create a ConsoleHandler that "logs" to an array instead
// of doing console IO.
const TestHandleConsole = (messages: any[][]): ConsoleHandler => ({
  'forgefx/core/console/log': (args: any[], step: Step<void>): void => {
    messages.push(args)
    step.next()
  }
})

const logged = []

// We need to provide handler implementations of the effects
// used by main. We can do that by just combining the handlers
// above
const handlers = {
  ...TestHandleReadline(['hi', 'hello', '']),
  ...TestHandleConsole(logged)
}

// And now we can run main with these handler implementations
// This doesn't do any real IO, and we could make assertions
// about the logged values.  Testability!
run({
  return: () => console.log('Collected', logged),
  throw: e => { throw e }
}, handlers, main())

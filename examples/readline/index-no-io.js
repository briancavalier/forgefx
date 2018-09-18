// @flow
import { type Cancel, type ConsoleHandler, type Result, type Step, run, withHandler, sync } from '../../packages/core'
import { type ReadlineHandler } from './readline-effect'
import { main } from './main'
import assert from 'assert'

// Let's create a ReadlineHandler that "reads" from a
// provided list of strings, rather than reading user input
// from stdin.
// Note that this "no IO" version, in contrast to the "real"
// version, is able to return strings *synchronously*, and
// that's OK. We can represent it directly by using sync()
// in 'forgefx/readline/read'
const TestHandleReadline = (messages: string[]): ReadlineHandler => ({
  'forgefx/readline/prompt': (prompt: string): Result<void> =>
    sync(),
  'forgefx/readline/read': (): Result<string> =>
    sync(messages.shift()),
  'forgefx/readline/close': (): Result<void> =>
    sync()
})

// And let's create a ConsoleHandler that "logs" to an array instead
// of doing console IO.
const TestHandleConsole = (messages: string[]): ConsoleHandler => ({
  'forgefx/core/console/log': (args: any[]): Result<void> => {
    messages.push(args.join())
    return sync()
  }
})

const logged: string[] = []

// We need to provide handler implementations of the effects
// used by main. We can do that by just combining the handlers
// above
const handler = {
  ...TestHandleReadline(['hi', 'hello', '']),
  ...TestHandleConsole(logged)
}

// And now we can run main with these handler implementations
// This doesn't do any real IO, and we could make assertions
// about the logged values.  Testability!
run({
  return: () => assert.deepStrictEqual(['you typed: hi', 'you typed: hello', 'Bye!'], logged),
  throw: e => { throw e }
}, withHandler(handler, main()))

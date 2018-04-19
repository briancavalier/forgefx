// @flow
import type { Action, Cancel, Effect, Step } from '../..'

// Let's use Node's readline ...
import readline from 'readline'

// ... by making a new Readline Effect.  First, we define the
// effect's handler interface. These are the core operations
// that our Readline API can use. We'll provide concrete
// implementations of them later.
// We need three operations:
// 1. prompt the user, and
// 2. read what the user typed
// 3. close the readline to free resources
export type ReadlineHandler = {|
  'forgefx/readline/prompt': (string, Step<void>) => void,
  'forgefx/readline/read': (void, Step<string>) => Cancel,
  'forgefx/readline/close': (void, Step<void>) => void
|}

// Now we can create the Effect and associate it with
// the interface we just defined.
export type Readline = Effect<ReadlineHandler>

// Let's implement a convenient Readline API that allows
// prompting the user and reading input.
// Notice how this API just produces "requests" for an
// effect to be performed, rather than calling Node's
// readline directly.
export function * prompt (prompt: string): Action<Readline, void> {
  return yield { op: 'forgefx/readline/prompt', arg: prompt }
}

export function * read (): Action<Readline, string> {
  return yield { op: 'forgefx/readline/read' }
}

export function * close (): Action<Readline, void> {
  return yield { op: 'forgefx/readline/close' }
}

// Now we can create an implementation of our Readline
// Effect.  For simplicity, we'll use a single instance
// of Node's readline Interface pointed at stdin & stdout
export const HandleReadline = (): ReadlineHandler => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  // Let's implement the required core Readline Effect
  // operations
  return {
    // The prompt operation is simple: since we're allowing
    // a different prompt each time, we can set our
    // readline instance's prompt and then display it.
    'forgefx/readline/prompt': (prompt, step) => {
      rl.setPrompt(prompt)
      step.next(rl.prompt())
    },
    // The read operation waits for the next line
    // from the readline we created above.  Note that it
    // also provides a way to cancel waiting for the line.
    'forgefx/readline/read': (_, step) => {
      const cb = line => step.next(line)
      rl.once('line', cb)
      return { cancel () { rl.removeListener('line', cb) } }
    },
    // The close operation is also trivial: close
    // the readline instance.
    'forgefx/readline/close': (_, step) =>
      step.next(rl.close())
  }
}

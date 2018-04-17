// @flow

// In this example, we'll prompt the user to type
// something in the terminal, and then echo it back
// after the user presses return.

// First, we need some core types and functions
import type { Action, Cancel, Effect, Console, Process, Step } from '../packages/core'
import { log, args, HandleConsole, HandleProcess, run_ } from '../packages/core'

// Let's use Node's readline ...
import readline from 'readline'

// ... by making a new Readline Effect.  First, we define the
// effect's handler interface. These are the core operations
// that our Readline API can use. We'll provide concrete
// implementations of them later.
// We need two operations:
// 1. prompt the user, and
// 2. read what the user typed
type ReadlineHandler = {|
  'fx/process/readline/prompt': (string, Step<void>, Cancel) => void,
  'fx/process/readline/read': (void, Step<string>, Cancel) => Cancel
|}

// Now we can create the Effect and associate it with
// the interface we just defined.
type Readline = Effect<ReadlineHandler>

// Let's implement a convenient Readline API that allows
// prompting the user and reading input.
// Notice how this API just produces "requests" for an
// effect to be performed, rather than calling Node's
// readline directly.
function * prompt (prompt: string): Action<Readline, void> {
  return yield { op: 'fx/process/readline/prompt', arg: prompt }
}

function * read (): Action<Readline, string> {
  return yield { op: 'fx/process/readline/read' }
}

// Now we can create an implementation of our Readline
// Effect.  For simplicity, we'll use a single instance
// of Node's readline Interface pointed at stdin & stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Let's implement the required core Readline Effect
// operations
const HandleReadline: ReadlineHandler = {
  // The prompt operation is simple: since we're allowing
  // a different prompt each time, we can set our
  // readline instance's prompt and then display it.
  'fx/process/readline/prompt': (prompt, step) => {
    rl.setPrompt(prompt)
    step.next(rl.prompt())
  },
  // The read operation waits for the next line
  // from the readline we created above.  Note that it
  // also provides a way to cancel waiting for the line.
  'fx/process/readline/read': (_, step) => {
    const cb = line => step.next(line)
    rl.once('line', cb)
    return { cancel: () => { rl.removeListener('line', cb) } }
  }
}

// Now that we have our new Readline Effect, let's
// write our echo program!
//
// Our main function will get a prompt string from the
// command line args (notice how this is also an effect),
// and then start the prompt -> echo -> prompt -> echo etc. loop
// Note how the return type indicates the 3 effects in
// our echo program:
// 1. Process, since we're reading process command line args
// 2. Console, since we're printing to the console
// 3. Readline, since we're using our new prompt and read operations
//
// Also note that we could use '*' as the return type and Flow would
// infer the correct type!  Kudos Flow!  It's nice to write it out
// for readability and documentation, though.
function * main (): Action<Process | Console | Readline, void> {
  // Get the last command line arg
  const promptString = (yield * args()).pop()

  // Loop forever, prompting the user, reading the user
  // input, and printing it to the console (another effect!).
  // We could use recursion, but let's use an imperative loop.
  // This is still an asynchronous program, but we can use
  // a very direct approach!
  while (true) {
    yield * prompt(promptString)
    const line = yield * read()
    if (line.trim()) yield * log(`you typed: ${line}`)
  }
}

// We need to provide handler implementations of those 3 effects.
// We can do that by just combining the handlers for each effect.
const handlers = {
  ...HandleProcess,
  ...HandleConsole,
  ...HandleReadline
}

// And now we can run main with the handler implementations
run_(handlers, main())

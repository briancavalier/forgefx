// @flow

// In this example, we'll prompt the user to type
// something in the terminal, and then echo it back
// after the user presses return.

// First, we need some core types and functions
import type { Action, Console } from '../../packages/core'
import { log } from '../../packages/core'
import { type Readline, close, prompt, read } from './readline-effect'

// Our main function will loop: prompt -> echo -> prompt -> echo etc.
// until the user enters an empty line, and then exit.
// Note how the return type indicates the effects in
// our echo program:
// 1. Console, since we're printing to the console
// 2. Readline, since we're using our new prompt, read, and close operations
//
// Also note that we could use '*' as the return type and Flow would
// infer the correct type!  Kudos Flow!  It's nice to write it out
// for readability and documentation, though.
export function * main (): Action<Console | Readline, void> {
  // Loop "forever", prompting the user, reading the user
  // input, and printing it to the console (another effect!).
  // We could use recursion, but let's use an imperative loop.
  // This is still an asynchronous program, but we can use
  // a very direct approach!
  while (true) {
    yield * prompt('> ')
    const line = yield * read()

    // If the line is empty, we're done
    if (!line.trim()) break

    yield * log(`you typed: ${line}`)
  }

  // When the loop exits, close the readline
  yield * close()
  yield * log('Bye!')
}

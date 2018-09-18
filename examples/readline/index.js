// @flow

// In this example, we'll prompt the user to type
// something in the terminal, and then echo it back
// after the user presses return.

// First, we need some core types and functions
import { HandleConsole, withHandler, run_ } from '../../packages/core'
import { HandleReadline } from './readline-effect'
import { main } from './main'

// We need to provide handler implementations of the effects
// used by main. We can do that by just combining the handlers
// for each effect.
const handler = {
  ...HandleConsole,
  ...HandleReadline()
}

// And now we can run main with the handler implementations
run_(withHandler(handler, main()))

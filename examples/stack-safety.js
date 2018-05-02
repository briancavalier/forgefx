// @flow
import { type ConsoleHandler, sync, log, run_ } from '../packages/core'

// TODO: Convert this example into a test case

// This example shows that *synchronous* effects, like console log
// run in constant stack space. If they naively used the same
// callback path as async effects, they would blow the stack.

// ConsoleHandler that doesn't actually log, since all we
// care about is proving that we're not adding stack frames
const HandleConsole: ConsoleHandler = {
  'forgefx/core/console/log': (args) => sync(undefined)
}

// Run a large enough number of synchronous effects, that
// we'd blow up if this was all continuation based.
function * main () {
  let i = 0
  const start = Date.now()
  while (i < 200000) {
    yield * log(i++)
  }
  // Since we squelched the console effect above,
  // we have to use console directly here.
  console.log('DONE', Date.now() - start)
}

run_(HandleConsole, main())

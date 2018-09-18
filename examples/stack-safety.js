// @flow
import { type ConsoleHandler, HandleConsole, HandleTime, now, handle, log, runPure, sync } from '../packages/core'

// TODO: Convert this example into a test case

// This example shows that *synchronous* effects, like console log
// run in constant stack space. If they naively used the same
// callback path as async effects, they would blow the stack.

// ConsoleHandler that doesn't actually log, since all we
// care about is proving that we're not adding stack frames
const FakeConsole: ConsoleHandler = {
  'forgefx/core/console/log': (args) => sync(undefined)
}

// Run a large enough number of synchronous effects, that
// we'd blow up if this was all continuation based.
function * test () {
  let i = 0
  while (i < 200000) {
    yield * log(i++)
  }
}

function * main() {
  const start = yield * now()

  // Run test with FakeConsole so it doesn't actually print anything
  yield * handle(FakeConsole, test())

  const end = yield * now()

  yield * log(`DONE ${end - start}`)
}

runPure(handle({ ...HandleConsole, ...HandleTime }, main()))

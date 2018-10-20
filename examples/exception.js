// @flow
import { type Action, type Except, type Console, log, withHandler, run_, attempt, raise, HandleConsole } from '../packages/core'

function * main (): * {
  // Use recover to eliminate the Except effect
  const a = yield* attempt(f())
  yield* log(a)
}

function * f (): Action<Except, number> {
  yield * raise(new Error('oops'))
  return 123
}

const handler = { ...HandleConsole }

run_(withHandler(handler, main()))

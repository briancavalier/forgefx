// @flow
import { type Action, type Async, type Console, type Op, type Time, log, now, delay, withHandler, timeout, run_, HandleAsync, HandleConsole, HandleTime } from '../packages/core'

function * main (): * {
  const start = yield* now()
  yield* log('start')

  yield* timeout(1000, delay(100000))

  const end = yield * now()
  yield* log(`whew! only had to wait ${end - start}!`)
}

const handler = { ...HandleAsync, ...HandleConsole, ...HandleTime }

run_(withHandler(handler, main()))

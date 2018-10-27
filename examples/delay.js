// @flow
import { type Action, type Async, type Console, type Op, type Time, log, time, delay, withHandler, timeout, run_, HandleAsync, HandleConsole, HandleTime } from '../packages/core'

function * main (): * {
  const start = yield* time()
  yield* log('start')

  yield* timeout(1000, delay(100000))

  const end = yield * time()
  yield* log(`whew! only had to wait ${end - start}!`)
}

const handler = { ...HandleAsync, ...HandleConsole, ...HandleTime }

run_(withHandler(handler, main()))

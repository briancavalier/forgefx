// @flow
import { type Action, type Async, type Console, type Time, log, date, delay, withHandler, timeout, run_, HandleAsync, HandleConsole, HandleTime } from '../packages/core'

function * main (): * {
  // const start = yield * date()
  // yield * log(start)
  //
  yield * timeout(1000, delay(100000))
  //
  // const end = yield * date()
  // yield * log(`whew! only had to wait ${end - start}!`)
}

const handler = { ...HandleAsync, ...HandleConsole, ...HandleTime }

run_(withHandler(handler, main()))

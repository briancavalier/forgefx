// @flow
import { type Action, type Async, type Console, type Time, log, date, delay, timeout, run_, HandleAsync, HandleConsole, HandleTime } from '../packages/core'

function * main (): Action<Console | Time | Async, void> {
  const start = yield * date()
  yield * log(start)

  yield * timeout(1000, delay(100000))

  const end = yield * date()
  yield * log(`whew! only had to wait ${end - start}!`)
}

const handlers = { ...HandleConsole, ...HandleAsync, ...HandleTime }

run_(handlers, main())

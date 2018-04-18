// @flow
import { log, date, delay, timeout, run_, HandleAsync, HandleConsole, HandleTime } from '..'

function * main (): * {
  const start = yield * date()
  yield * log(start)

  yield * timeout(1000, delay(100000))

  const end = yield * date()
  yield * log(`whew! only had to wait ${end - start}!`)
}

const handlers = { ...HandleConsole, ...HandleAsync, ...HandleTime }

run_(handlers, main())

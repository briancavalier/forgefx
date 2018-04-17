// @flow
import { log, delay, timeout, run_, HandleAsync, HandleConsole } from '..'

function * main (): * {
  yield * timeout(1000, delay(100000))
  yield * log(`whew! didn't have to wait 100 seconds!`)
}

const handlers = { ...HandleConsole, ...HandleAsync }

run_(handlers, main())

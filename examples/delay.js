import { log, delay, timeout, runPromise, HandleAsync, HandleConsole } from '../src'

function * main () {
  yield * timeout(1000, delay(100000))
  yield * log(`whew! didn't have to wait 100 seconds!`)
}

const handlers = [HandleAsync, HandleConsole]

runPromise(handlers, main())
  .catch(e => console.error(e))

import { log, delay, timeout, runPromise, Console, Async } from '../src'

function * main () {
  yield * timeout(1000, delay(100000))
  yield * log(`whew! didn't have to wait 100 seconds!`)
}

const handlers = [Console, Async]

runPromise(handlers, main())
  .catch(e => console.error(e))

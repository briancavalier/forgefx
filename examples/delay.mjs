import { log, delay, first, runPromise, Console, Async } from '../src'

function * main () {
  yield * timeout(1000, delay(100000))
  yield * log(`whew! didn't have to wait 100 seconds!`)
}

// TODO: Potentially useful, move to effects?
function * timeout (ms, p) {
  return yield * first([delay(ms), p])
}

const handlers = {...Console, ...Async}

runPromise(handlers, main())
  .catch(e => console.error(e))

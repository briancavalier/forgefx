// @flow
import { log, date, delay, timeout, run_, handle, update, HandleAsync, HandleConsole, HandleState, HandleTime } from '../packages/core'
import type { Async, Console, Time, Action, Effect, State, Step } from '../packages/core'

const withState = <S, E, A> (s: S, action: Action<State<S> | E, A>): Action<E, A> =>
  handle(HandleState({ value: s }), action)

const inc = (): Action<State<number>, number> =>
  update(x => x + 1)

function * main (): Action<Time | Console | Async | State<number>, void> {
  yield * log(yield * inc())

  const start = yield * date()
  yield * log(start)

  yield * log(yield * inc())

  yield * timeout(1000, delay(100000))

  yield * log(yield * inc())

  const end = yield * date()
  yield * log(`whew! only had to wait ${end - start}!`)

  yield * log(yield * inc())
}

const handlers = { ...HandleConsole, ...HandleAsync, ...HandleTime }

let m = withState(0, main())
run_(handlers, m)

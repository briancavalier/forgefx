// @flow
import type { Action, Step } from '../types'

export type CoreHandler = {|
  'forgefx/core/handle': <A, R, B>({ handler: (A, Step<B>) => R, arg: A }, Step<B>) => R
|}

export function * handle <H: {}, E, F, A> (handlers: H, action: Action<F | E, A>): Action<E, A> {
  let r: any = action.next()
  while (!r.done) {
    const h = handlers[r.value.op]
    const e = h ? wrap(h, r.value.arg) : r.value
    const x = yield e
    r = action.next(x)
  }

  // $FlowFixMe Why doesn't flow like the type here?
  return r.value
}

const wrap = (handler, arg) =>
  ({ op: 'forgefx/core/handle', arg: { handler, arg } })

// @flow
import type { Action, Effect, Step } from '../types'

export type CoreHandler = {|
  'forgefx/core/handle': <A, R, B>({ handler: (A, Step<B>) => R, arg: A }, Step<B>) => R
|}

export function * withHandler <H: {}, E, A> (handler: H, action: Action<Effect<H> | E, A>): Action<E, A> {
  let r: any = action.next()
  while (!r.done) {
    const h = handler[r.value.op]
    const e = h ? wrap(h, r.value.arg) : r.value
    const x = yield e

    r = action.next(x)
  }

  // $FlowFixMe Why doesn't flow like the type here?
  return r.value
}

const wrap = (handler, arg) =>
  ({ op: 'forgefx/core/handle', arg: { handler, arg } })

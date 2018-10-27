// @flow
import { type Cancel, type Step } from '../types'

// A Resume represents either a synchronous result, available
// now, or an asynchronous result which will become available
// later and is cancelable.
export type Now<A> = { now: true, value: A }
export type Later<H, A> = { now: false, run: (Step<A>, H) => Cancel }
export type Resume<H, A> = Now<A> | Later<H, A>

export const resumeNow = <A> (value: A): Now<A> =>
  ({ now: true, value })

export const resumeNowVoid: Now<void> = resumeNow()

export const resumeLater = <H, A> (run: (Step<A>, H) => Cancel): Later<H, A> =>
  ({ now: false, run })

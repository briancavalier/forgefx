// @flow
import { Cancel } from './types'

// A Result represents either a synchronous result, available
// now, or an async result which will become available later.
// They share the Cancel interface to make types simpler, even
// though canceling a synchronous result will never actually
// cancele anything.
export type Result<A> =
  | { now: true, value: A, cancel (): void } // sync
  | { now: false, cancel (): void } // async

export const sync = <A> (value: A): Result<A> =>
  new Sync(value)

export const async = <A> (canceler: Cancel): Result<A> =>
  new Async(canceler)

class Sync<A> implements Cancel {
  now: true
  value: A
  constructor (value: A) {
    this.now = true
    this.value = value
  }
  cancel (): void {}
}

class Async implements Cancel {
  now: false
  _canceler: Cancel
  constructor (canceler: Cancel) {
    this.now = false
    this._canceler = canceler
  }
  cancel (): void {
    return this._canceler.cancel()
  }
}

// @flow
import { type Cancel } from '../types'
import { type Either, left, right } from '../data/either'

// A Result represents either a synchronous result, available
// now, or an asynchronous result which will become available
// later and is cancelable.
export type Result<A> = Either<Cancel, A>

export { left as async, right as sync }

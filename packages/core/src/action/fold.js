// @flow
import type { Action } from '../types'
import { all } from './traverse'

export function * fold <E, A, B> (f: (B, A) => B, b: B, ai: Action<E, A>[]): Action<E, B> {
  let r = b
  for (const a of yield * all(ai)) {
    r = f(r, a)
  }
  return r
}

export function * foldmm <E, F, A, B> (f: (B, A) => Action<F, B>, b: B, ai: Action<E, A>[]): Action<E | F, B> {
  let aa = yield * all(ai)
  return yield * foldm(f, b, aa)
}

export function * foldm <E, A, B> (f: (B, A) => Action<E, B>, b: B, ai: A[]): Action<E, B> {
  let r = b
  for (const a of ai) {
    r = yield * f(r, a)
  }
  return r
}

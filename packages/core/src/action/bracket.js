// @flow
import type { Action } from '../types'
import { type Except, raise } from '../effect'
import { attempt, ensure } from './attempt'
import { map } from './base'

export function * using <E1, E2, E3, A, B> (acquire: Action<Except | E1, [Action<E3, void>, A]>, use: A => Action<Except | E2, B>): Action<Except | E1 | E2 | E3, B> {
  const ea = yield* attempt(acquire)
  if (!ea.right) return yield* raise(ea.value)

  const [release, a] = ea.value
  return yield* ensure(use(a), release)
}

export const bracket = <E1, E2, E3, A, B> (acquire: Action<Except | E1, A>, release: A => Action<E3, void>, use: A => Action<Except | E2, B>): Action<Except | E1 | E2 | E3, B> =>
  using(map(a => [release(a), a], acquire), use)

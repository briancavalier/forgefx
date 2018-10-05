// @flow
import type { Action, Cancel, Cont } from './types'
import { runAction } from './runtime'
import { HandleCore } from './handler'

const throwOnError = eea => {
  if (!eea.right) throw eea.value
}

export const run = <A> (cont: Cont<A>, action: Action<empty, A>): Cancel =>
  runAction(cont, action, HandleCore)

export const run_ = <A> (action: Action<empty, A>): Cancel =>
  run(throwOnError, action)

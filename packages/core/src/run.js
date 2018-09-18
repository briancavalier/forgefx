// @flow
import type { Action, Cancel, Cont } from './types'
import { runAction, createScope } from './runtime'
import { HandleCore } from './handler'

const throwOnError = {
  return: any => {},
  throw: e => { throw e }
}

export const runPureAnd = <A> (cont: Cont<A>, action: Action<empty, A>): Cancel =>
  runAction(cont, action, createScope(HandleCore))

export const runPure = <A> (action: Action<empty, A>): Cancel =>
  runPureAnd(throwOnError, action)

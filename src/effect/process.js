// @flow
import type { Action, Cancel, Step, Effect } from '../types'

export type ProcessHandler = {|
  'fx/process/args': (void, Step<string[]>, Cancel) => void
|}

export type Process = Effect<ProcessHandler>

export function * args (): Action<Process, string[]> {
  return yield ({ op: 'fx/process/args' })
}

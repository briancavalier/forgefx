// @flow
import type { Action, Step, Effect } from '../types'

export type ProcessHandler = {|
  'forgefx/core/process/args': (void, Step<string[]>) => void
|}

export type Process = Effect<ProcessHandler>

export function * args (): Action<Process, string[]> {
  return yield { op: 'forgefx/core/process/args' }
}

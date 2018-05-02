// @flow
import type { Action, Effect, Step } from '../types'
import type { Result } from '../result'

export type ProcessHandler = {|
  'forgefx/core/process/args': (void, Step<string[]>) => Result<string[]>,
  'forgefx/core/process/getEnv': (string, Step<?string>) => Result<?string>
|}

export type Process = Effect<ProcessHandler>

export function * args (): Action<Process, string[]> {
  return yield { op: 'forgefx/core/process/args' }
}

export function * getEnv (arg: string): Action<Process, ?string> {
  return yield { op: 'forgefx/core/process/getEnv', arg }
}

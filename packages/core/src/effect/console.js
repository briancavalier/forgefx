// @flow
import type { Action, Effect, Step } from '../types'
import type { Result } from '../result'

export type ConsoleHandler = {|
  'forgefx/core/console/log': (any[], Step<void>) => Result<void>
|}

export type Console = Effect<ConsoleHandler>

export function * log (...arg: any[]): Action<Console, void> {
  return yield { op: 'forgefx/core/console/log', arg }
}

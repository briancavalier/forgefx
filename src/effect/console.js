// @flow
import type { Action, Cancel, Effect, Step } from '../types'

export type ConsoleHandler = {|
  'forgefx/core/console/log': (any[], Step<void>, Cancel) => void
|}

export type Console = Effect<ConsoleHandler>

export function * log (...arg: any[]): Action<Console, void> {
  return yield { op: 'forgefx/core/console/log', arg }
}

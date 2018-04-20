// @flow
import type { Action, Effect, Step } from '../types'

export type ConsoleHandler = {|
  'forgefx/core/console/log': (any[], Step<void>) => void
|}

export type Console = Effect<ConsoleHandler>

export function * log (...arg: any[]): Action<Console, void> {
  return yield { op: 'forgefx/core/console/log', arg }
}

// @flow
import type { Action, Effect, Step } from '../types'
import type { Resume } from '../runtime'

export type ConsoleHandler = {|
  'forgefx/core/console/log': <H>(any[]) => Resume<Console, void>
|}

export type Console = Effect<ConsoleHandler>

export function * log (...arg: any[]): Action<Console, void> {
  return yield { op: 'forgefx/core/console/log', arg }
}

// @flow
import type { Action, MakeEffect, Step } from '../types'

export interface ConsoleHandler {
  effect: 'fx/console',
  log (any[], Step<void>): void
}

export type Console = MakeEffect<ConsoleHandler>

export function * log (...arg: any[]): Action<Console, void> {
  return yield { effect: 'fx/console', op: 'log', arg }
}

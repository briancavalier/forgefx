// @flow
import type { Action, Context, Effect, Named } from '../types'

type ConsoleEffect = 'console'

export interface ConsoleHandler extends Named<ConsoleEffect> {
  log (args: any[], Context<void>): void
}

export type Console = Effect<ConsoleEffect, ConsoleHandler>

export function * log (...arg: any[]): Action<Console, void> {
  return yield { effect: 'console', op: 'log', arg }
}

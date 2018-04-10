// @flow
import type { Action, Context, Effect, Named } from '../types'

type ProcessEffect = 'process'

export interface ProcessHandler extends Named<ProcessEffect> {
  args (_: void, Context<string[]>): void
}

export type Process = Effect<ProcessEffect, ProcessHandler>

export function * args (): Action<Process, string[]> {
  return yield ({ effect: 'process', op: 'args', arg: undefined })
}

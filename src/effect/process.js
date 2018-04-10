// @flow
import type { Action, Step, MakeEffect, Named } from '../types'

export interface ProcessHandler extends Named<'fx/process'> {
  args (void, Step<string[]>): void
}

export type Process = MakeEffect<ProcessHandler>

export function * args (): Action<Process, string[]> {
  return yield ({ effect: 'fx/process', op: 'args', arg: undefined })
}

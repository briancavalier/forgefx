// @flow
import type { Action, Process } from '../../packages/core'
import { getEnv } from '../../packages/core'

// TODO: WIP!

export function * main(): Action<Process, void> {
  const port = (yield * getEnv('PORT')) || 3000
}

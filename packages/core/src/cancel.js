// @flow
import type { Cancel } from './types'

export const uncancelable: Cancel = {
  cancel (): void {}
}

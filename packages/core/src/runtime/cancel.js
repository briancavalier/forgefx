// @flow
import type { Cancel } from '../types'

export const uncancelable: Cancel = () => {}

export const cancelBoth = (c1: Cancel, c2: Cancel): Cancel =>
  () => {
    c1()
    c2()
  }

export const cancelAll = (cs: Cancel[]): Cancel =>
  () => cs.forEach(cancel => cancel())

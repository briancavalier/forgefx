// @flow
import type { Step } from '../types'

export interface Context<H, A> extends Step<A> {
  handler: H
}

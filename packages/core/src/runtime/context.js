// @flow
import type { Cancel, Step } from '../types'

export class Scope<H> implements Cancel {
  handlers: H
  cancelers: Cancel[]

  constructor (handlers: H, cancelers: Cancel[]) {
    this.handlers = handlers
    this.cancelers = cancelers
  }

  cancel (): void {
    const cancelers = this.cancelers
    this.cancelers = []
    return cancelers.forEach(c => c.cancel())
  }
}

export interface Context<H, A> extends Step<A> {
  scope: Scope<H>
}

export const createScope = <H> (handlers: H): Scope<H> =>
  new Scope(handlers, [])

export const childScope = <H>(scope: Scope<H>): Scope<H> =>
  childScopeWith({}, scope)

export const childScopeWith = <H0, H1> (handlers: H1, scope: Scope<H0>): Scope<{ ...H0, ...H1 }> => {
  const child = createScope({ ...scope.handlers, ...handlers })
  scope.cancelers.push(child)
  return child
}

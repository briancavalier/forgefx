// @flow
import type { Action, Cancel, Cont, Step } from '../types'
import { Coroutine } from './coroutine'

export class Scope<H> implements Cancel {
  handlers: H
  cancelers: Cancel[]

  constructor (handlers: H, cancelers: Cancel[]) {
    this.handlers = handlers
    this.cancelers = cancelers
  }

  cancel () {
    const cancelers = this.cancelers
    this.cancelers = []
    cancelers.forEach(c => c.cancel())
  }
}

export interface Scoped<H> {
  scope: Scope<H>
}

export interface Context<H, A> extends Step<A>, Scoped<H> {}

export const createScope = <H> (handlers: H): Scope<H> =>
  new Scope(handlers, [])

export const childScope = <H>(scope: Scope<H>): Scope<H> =>
  childScopeWith({}, scope)

export const childScopeWith = <H0, H1> (handlers: H1, scope: Scope<H0>): Scope<{ ...H0, ...H1 }> => {
  const child = createScope({ ...scope.handlers, ...handlers })
  scope.cancelers.push(child)
  return child
}

export const runAction = <H, E, A> (cont: Cont<A>, action: Action<E, A>, scope: Scope<H>): Cancel => {
  const co = new Coroutine(cont, scope, action)
  scope.cancelers.push(co)
  co.run()
  return co
}

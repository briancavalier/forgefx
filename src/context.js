// @flow
import type { Action, Cancel, Cont } from './types'
import { Coroutine } from './coroutine'

export const createContext = <H> (handlers: H): Context<H> =>
  new Context(handlers, [])

export const childContext = <H>(context: Context<H>): Context<H> =>
  childContextWith({}, context)

export const childContextWith = <H0, H1> (handlers: H1, context: Context<H0>): Context<{...H0, ...H1}> => {
  const child = createContext({...context.handlers, ...handlers})
  context.cancelers.push(child)
  return child
}

export const runAction = <H, E, A> (cont: Cont<A>, action: Action<E, A>, context: Context<H>): Cancel => {
  const co = new Coroutine(cont, context, action)
  context.cancelers.push(co)
  co.run()
  return co
}

export class Context<H> {
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

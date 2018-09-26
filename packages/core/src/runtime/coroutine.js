// @flow
import type { Action, Cancel, Cont, Next } from '../types'
import type { Scope, Context } from './context'
import type { Result } from './result'
import { uncancelable } from './cancel'
import { handleEffect } from './handle'

export const runAction = <H, E, A> (cont: Cont<A>, action: Action<E, A>, scope: Scope<H>): Cancel => {
  const co = new Coroutine(cont, scope, action)
  scope.cancelers.push(co)
  co.run()
  return co
}

export class Coroutine<H, E, A> implements Context<H, A> {
  continuation: Cont<A>
  scope: Scope<H>
  action: Action<E, A>
  _cancelCurrentStep: Cancel

  constructor (continuation: Cont<A>, scope: Scope<H>, action: Action<E, A>) {
    this.continuation = continuation
    this.scope = scope
    this.action = action
    this._cancelCurrentStep = uncancelable
  }

  run (): void {
    this.next(undefined)
  }

  step <B, C> (step: B => Next<C, A>, b: B): void {
    // WARNING: very ugly, unsafe imperative code ahead!
    // This has very important goals, and handles synchronous
    // and asynchronous effects:
    // 1. *Both* run in constant stack space
    // 1. Synchronous effects run without needing to use callbacks
    // These loop vars are reused and overwritten with different
    // types of values, so we have to declare them as any.  At
    // least we can declare the shape of n and r.
    let x: any = b
    let n: Next<any, any>
    let r: Result<any>

    while (true) {
      try {
        n = step.call(this.action, x)
      } catch (e) {
        return this.abort(e)
      }

      if (n.done) {
        // n.value is definitely an A, but because
        // InterableResult declares it as ?A, we have to cast
        return this.return(((n.value: any): A))
      }

      r = handleEffect(n.value, this)

      // If the effect returned an immediate result
      // use it, and continue to loop synchronously, thereby
      // not growing the stack.  Otherwise, break the loop
      // and re-enter step() asynchronously when the
      // (presumably async) effect calls next()
      if (r.right) {
        this._cancelCurrentStep = uncancelable
        x = r.value
      } else {
        this._cancelCurrentStep = r.value
        break
      }
    }
  }

  next <B> (b: B): void {
    this.step(this.action.next, b)
  }

  throw (e: Error): void {
    this.step(this.action.throw, e)
  }

  abort (e: Error): void {
    this.cancel()
    this.continuation.throw(e)
  }

  return (a: A): void {
    this.cancel()
    this.continuation.return(a)
  }

  cancel (): void {
    const c = this._cancelCurrentStep
    this._cancelCurrentStep = uncancelable
    c.cancel()
  }
}

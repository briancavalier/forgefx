// @flow
import type { Action, Cancel, Cont, Next } from './types'
import type { Scope, Context } from './context'

export const uncancelable: Cancel = {
  cancel () {}
}

export const handleEffect = <H, A> ({ op, arg }: any, context: Context<H, A>): Cancel => {
  const h = (context.scope.handlers: any)[op]
  if (!h) throw new Error(`no handler for: ${String(op)}`)

  return h(arg, context)
}

export class Coroutine<H, E, A> implements Context<H, A> {
  continuation: Cont<A>
  scope: Scope<H>
  program: Action<E, A>
  _cancelCurrentStep: Cancel

  constructor (continuation: Cont<A>, scope: Scope<H>, program: Action<E, A>) {
    this.continuation = continuation
    this.scope = scope
    this.program = program
    this._cancelCurrentStep = uncancelable
  }

  run (): void {
    this.safeStep(this.program.next, undefined)
  }

  safeStep <B, C> (step: B => Next<C, A>, b: B): void {
    try {
      this.unsafeStep(step.call(this.program, b))
    } catch (e) {
      this.abort(e)
    }
  }

  unsafeStep <B> (n: Next<B, A>): void {
    if (n.done) this.return(((n.value: any): A))
    else this._cancelCurrentStep = handleEffect(n.value, this) || uncancelable
  }

  next <B> (b: B): void {
    this.safeStep(this.program.next, b)
  }

  throw (e: Error): void {
    this.safeStep(this.program.throw, e)
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

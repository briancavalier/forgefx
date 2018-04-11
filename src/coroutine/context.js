// @flow
import type { Action, Cancel, Cont, Next } from '../types'

export const createChild = <E, A, B>(continuation: Cont<B>, program: Action<E, B>, { handle }: Coroutine<E, A>): Coroutine<E, B> =>
  new Coroutine(continuation, handle, program)

export const uncancelable: Cancel = {
  cancel () {}
}

export class Coroutine<E, A> {
  continuation: Cont<A>
  handle: any
  program: Action<E, A>
  _canceler: Cancel

  constructor (continuation: Cont<A>, handle: any, program: Action<E, A>) {
    this.continuation = continuation
    this.handle = handle
    this.program = program
    this._canceler = uncancelable
  }

  run (): Cancel {
    this.safeStep(this.program.next, undefined)
    return this
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
    else this._canceler = this.handle(n.value, this) || uncancelable
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
    const c = this._canceler
    this._canceler = uncancelable
    c.cancel()
  }
}

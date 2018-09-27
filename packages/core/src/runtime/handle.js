// @flow
import type { Cont, Step } from '../types'
import type { Context } from './context'
import { type Result } from './result'

export const handleEffect = <H, A> ({ op, arg }: any, context: Context<H, A>): Result<A> => {
  const h = (context.scope.handlers: any)[op]
  if (!h) throw new Error(`Unhandled effect: ${String(op)}`)

  return h(arg, context)
}

export class StepCont<A> implements Cont<A> {
  step: Step<A>
  constructor (step: Step<A>) {
    this.step = step
  }

  return (a: A): void {
    this.step.next(a)
  }

  throw (e: Error): void {
    this.step.throw(e)
  }
}
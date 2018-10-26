// @flow
import type { Cont, Step } from '../types'
import type { Resume } from './result'

export const handleEffect = <H, A> ({ op, arg }: any, handler: H): Resume<H, A> => {
  const h = (handler: any)[op]
  if (!h) throw new Error(`Unhandled effect: ${String(op)}`)

  return h(arg)
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

import { MissingEffect } from './effect'
import { Missing } from './handler/missing-handler'

export const run = (continuation, handlers, program) =>
  new Run(continuation, {...Missing, ...handlers}, {}, program).run()

export const runPromise = (handlers, program) =>
  new Promise((resolve, reject) =>
    run({ return: resolve, throw: reject }, handlers, program))

export const findHandler = ({ effect }, handlers) =>
  handlers[effect] || handlers[MissingEffect]

class Run {
  constructor (complete, handlers, resources, program) {
    this.complete = complete
    this.handlers = handlers
    this.resources = resources
    this.program = program
  }

  run () {
    this.safeStep(this.program.next, undefined)
  }

  safeStep (k, x) {
    try {
      this.unsafeStep(k.call(this.program, x))
    } catch (e) {
      this.abort(e)
    }
  }

  unsafeStep ({ done, value }) {
    if (done) this.return(value)
    else this.perform(value)
  }

  perform (effect) {
    const handler = findHandler(effect, this.handlers)
    handler(effect, this)
  }

  next (x, r) {
    if (r !== undefined) {
      this.resources = r
    }
    this.safeStep(this.program.next, x)
  }

  throw (e) {
    this.safeStep(this.program.throw, e)
  }

  abort (e) {
    this.complete.throw(e)
  }

  return (y) {
    this.complete.return(y)
  }
}

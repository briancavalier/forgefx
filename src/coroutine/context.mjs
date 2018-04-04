import { MissingEffect } from '../effect/missing'

export const childContext = (continuation, program, { handlers }) =>
  new Context(continuation, handlers, program)

const noopCanceler = {
  cancel () {}
}

export const findHandler = ({ effect }, handlers) =>
  handlers[effect] || handlers[MissingEffect]

export class Context {
  constructor (continuation, handlers, program) {
    this.continuation = continuation
    this.handlers = handlers
    this.program = program
    this._canceler = noopCanceler
  }

  run () {
    this.safeStep(this.program.next, undefined)
  }

  safeStep (step, x) {
    try {
      this.unsafeStep(step.call(this.program, x))
    } catch (e) {
      this.abort(e)
    }
  }

  unsafeStep ({ done, value }) {
    done ? this.return(value) : this.handle(value)
  }

  handle (effect) {
    const handler = findHandler(effect, this.handlers)
    this._canceler = handler(effect, this) || noopCanceler
  }

  next (x) {
    this.safeStep(this.program.next, x)
  }

  throw (e) {
    this.safeStep(this.program.throw, e)
  }

  abort (e) {
    this.cancel()
    this.continuation.throw(e)
  }

  return (x) {
    this.cancel()
    this.continuation.return(x)
  }

  cancel () {
    const c = this._canceler
    this._canceler = noopCanceler
    c.cancel()
  }
}

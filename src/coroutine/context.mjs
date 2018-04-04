import { MissingEffect } from '../effect/missing'

export const childContext = (continuation, key, program, { handlers }) =>
  new Context(continuation, handlers, key, program)

const noopCanceler = {
  cancel () {}
}

export const findHandler = ({ effect }, handlers) =>
  handlers[effect] || handlers[MissingEffect]

export class Context {
  constructor (continuation, handlers, key, program) {
    this.continuation = continuation
    this.handlers = handlers
    this.key = key
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

  abort (value) {
    this.cancel()
    this.continuation.throw({ key: this.key, value })
  }

  return (value) {
    this.cancel()
    this.continuation.return({ key: this.key, value })
  }

  cancel () {
    const c = this._canceler
    this._canceler = noopCanceler
    c.cancel()
  }
}

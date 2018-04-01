import { MissingEffect } from './effect'

export const childContext = (context, continuation, key, program) =>
  new Context(continuation, context.handlers, Object.create(context.resources), key, program)

export const findHandler = ({ effect }, handlers) =>
  handlers[effect] || handlers[MissingEffect]

export class Context {
  constructor (continuation, handlers, resources, key, program) {
    this.continuation = continuation
    this.handlers = handlers
    this.resources = resources
    this.key = key
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
    this.continuation.throw(e)
  }

  return (value) {
    this.continuation.return({ key: this.key, value })
  }
}

export const childContext = (continuation, program, { handle }) =>
  new Context(continuation, handle, program)

export const runContext = context => {
  context.run()
  return context
}

export const uncancelable = {
  cancel () {}
}

export class Context {
  constructor (continuation, handle, program) {
    this.continuation = continuation
    this.handle = handle
    this.program = program
    this._canceler = uncancelable
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
    if (done) this.return(value)
    else this._canceler = this.handle(value, this) || uncancelable
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
    this._canceler = uncancelable
    c.cancel()
  }
}

export const run = (handlers, program) =>
  new Promise((resolve, reject) =>
    new Run({ return: resolve, throw: reject }, {Missing, ...handlers}, {}, program).run())

export const pipe = (...ps) =>
  function * sequence (x) {
    for (const p of ps) x = yield * p(x)
    return x
  }

export const Missing = (x, r, resume) =>
  resume.throw(new Error(`no handler for: ${x && typeof x.effect === 'string' ? x.effect : x}`))

export const findHandler = ({ effect }, handlers) =>
  handlers[effect] || handlers['Missing']

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
    handler(effect, this.resources, this)
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

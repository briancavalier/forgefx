import { childContext, start } from '../coroutine/context'

export const AsyncEffect = Symbol('fx/async')

export function * callAsync (f) {
  return yield ({ effect: AsyncEffect, f })
}

export function * callNode (nodef, ...args) {
  return yield * callAsync(context =>
    nodef(...args, (e, x) => e ? context.throw(e) : context.next(x)))
}

// TODO: Implement as effect+handler so timers can be
// abstracted. e.g. fx/timer.
export function * delay (ms) {
  return yield * callAsync(context => {
    const t = setTimeout(() => context.next(), ms)
    return { cancel: () => clearTimeout(t) }
  })
}

export function * all (ps) {
  return yield * callAsync(runAll(ps))
}

const cancel = c => c.cancel()

const runAll = ps => context =>
  new AllContinuation(ps, context)

class AllContinuation {
  constructor (programs, context) {
    this.context = context
    this.remaining = programs.length
    this.results = Array(programs.length)
    this.children = programs.map((p, i) => childContext(this, i, p, this.context))
    this.children.forEach(start)
  }

  return ({ key, value }) {
    this.results[key] = value
    if (--this.remaining === 0) this.context.next(this.results)
  }

  throw ({ value }) {
    if (this.remaining === 0) return

    this.remaining = 0
    this.cancel()
    this.context.throw(value)
  }

  cancel () {
    this.children.forEach(cancel)
  }
}

export function * first (ps) {
  return yield * callAsync(runFirst(ps))
}

const runFirst = ps => context =>
  new FirstContinuation(ps, context)

class FirstContinuation {
  constructor (programs, context) {
    this.context = context
    this.done = false
    this.children = programs.map((p, i) => childContext(this, i, p, this.context))
    this.children.forEach(start)
  }

  return (x) {
    if(!this.done) this.complete(this.context.next, x)
  }

  throw (x) {
    if(!this.done) this.complete(this.context.throw, x)
  }

  complete (step, { key, value }) {
    this.done = true
    this.cancel()
    step.call(this.context, value)
  }

  cancel () {
    this.children.forEach(cancel)
  }
}

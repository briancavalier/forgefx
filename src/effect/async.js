import { childContext, runContext } from '../coroutine/context'

export const AsyncEffect = Symbol('fx/async')

export function * callAsync (f) {
  return yield ({ effect: AsyncEffect, f })
}

export const callNode = (nodef, ...args) =>
  callAsync(context =>
    nodef(...args, (e, x) => e ? context.throw(e) : context.next(x)))

// TODO: Implement as effect+handler so timers can be
// abstracted. e.g. fx/timer.
export const delay = (ms, x = undefined) =>
  callAsync(context => performDelay(ms, x, context))

const performDelay = (ms, x, context) =>
  new CancelTimer(setTimeout(onTimer, ms, x, context))

const onTimer = (x, context) => context.next(x)

class CancelTimer {
  constructor (timer) {
    this.timer = timer
  }

  cancel () {
    clearTimeout(this.timer)
  }
}

export const timeoutWith = (ms, x, p) =>
  first([delay(ms, x), p])

export const timeout = (ms, p) =>
  timeoutWith(ms, undefined, p)

export const all = (ps) =>
  callAsync(runAll(ps))

const cancel = c => c.cancel()

const runAll = ps => context =>
  new AllContinuation(ps, context)

class IndexContinuation {
  constructor (index, results, continuation) {
    this.index = index
    this.results = results
    this.continuation = continuation
  }

  return (x) {
    this.results[this.index] = x
    this.continuation.return(this.index)
  }

  throw (e) {
    this.continuation.throw(e)
  }
}

class AllContinuation {
  constructor (programs, context) {
    this.context = context
    this.remaining = programs.length
    this.results = Array(programs.length)
    this.children = programs.map((p, i) =>
      runContext(childContext(new IndexContinuation(i, this.results, this), p, this.context)))
  }

  return (index) {
    if (--this.remaining === 0) this.context.next(this.results)
  }

  throw (e) {
    if (this.remaining === 0) return

    this.remaining = 0
    this.cancel()
    this.context.throw(e)
  }

  cancel () {
    this.children.forEach(cancel)
  }
}

export const first = (ps) =>
  callAsync(runFirst(ps))

const runFirst = ps => context =>
  new FirstContinuation(ps, context)

class FirstContinuation {
  constructor (programs, context) {
    this.context = context
    this.done = false
    this.children = programs.map((p, i) => runContext(childContext(this, p, this.context)))
  }

  return (x) {
    if (!this.done) this._complete(this.context.next, x)
  }

  throw (x) {
    if (!this.done) this._complete(this.context.throw, x)
  }

  _complete (step, x) {
    this.done = true
    this.cancel()
    step.call(this.context, x)
  }

  cancel () {
    this.children.forEach(cancel)
  }
}

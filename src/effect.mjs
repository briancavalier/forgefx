import { childContext } from './context'

export const MissingEffect = Symbol('fx/missing')

export const ConsoleEffect = Symbol('fx/console')

export function * log (...args) {
  return yield ({ effect: ConsoleEffect, op: 'log', args })
}

export const FileEffect = Symbol('fx/file')

export function * readFile (path, encoding) {
  return yield ({ effect: FileEffect, op: 'readFile', args: [path, encoding] })
}

export const StateEffect = Symbol('fx/state')

export function * get (key) {
  return yield ({ effect: StateEffect, op: 'read', key })
}

export function * set (key, value) {
  return yield ({ effect: StateEffect, op: 'write', key, value })
}

export function * update (key, f) {
  return yield * set(key, f(yield * get(key)))
}

export const AsyncEffect = Symbol('fx/async')

export function * callAsync (f) {
  return yield ({ effect: AsyncEffect, f })
}

export function * callNode (nodef) {
  return yield * callAsync(context =>
    nodef((e, x) => e ? context.throw(e) : context.next(x)))
}

export function * all (ps) {
  return yield * callAsync(runAll(ps))
}

const runAll = ps => context => new AllContinuation(ps, context)

class AllContinuation {
  constructor (programs, context) {
    this.context = context
    this.remaining = programs.length
    this.results = Array(programs.length)
    this.children = programs.map((p, i) => childContext(this.context, this, i, p))
    this.children.forEach(c => c.run())
  }

  return ({ key, value }) {
    this.results[key] = value
    if (--this.remaining === 0) {
      this.context.next(this.results)
    }
  }

  throw (e) {
    this.children.forEach(c => c.return(e))
    this.context.throw(e)
  }
}

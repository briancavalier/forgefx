
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

export function * call (f) {
  return yield ({ effect: AsyncEffect, f })
}

export function * callNode (nodef) {
  return yield * call(context =>
    nodef((e, x) => e ? context.throw(e) : context.next(x)))
}

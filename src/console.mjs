export const ConsoleEffect = Symbol.for('Console')

export function * log (...args) {
  return yield ({ effect: ConsoleEffect, op: 'log', args })
}

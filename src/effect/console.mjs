export const ConsoleEffect = Symbol('fx/console')

export function * log (...args) {
  return yield ({ effect: ConsoleEffect, op: 'log', args })
}

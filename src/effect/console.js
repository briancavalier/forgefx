export const Console = Symbol('fx/console')

export function * log (...args) {
  return yield ({ effect: Console, op: 'log', args })
}

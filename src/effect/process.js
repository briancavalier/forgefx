export const Process = Symbol('fx/process')

export function * args () {
  return yield ({ effect: Process, op: 'args' })
}

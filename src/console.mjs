export const Console = ({ op, args }, r, resume) =>
  resume.next(console[op](...args))

export function * log (...args) {
  return yield ({ effect: 'Console', op: 'log', args })
}

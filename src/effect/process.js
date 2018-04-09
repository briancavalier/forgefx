export const ProcessArgsEffect = Symbol('fx/process/args')

export function * args () {
  return yield ({ effect: ProcessArgsEffect })
}

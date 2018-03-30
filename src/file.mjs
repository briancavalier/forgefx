import fs from 'fs'

export const File = ({ op, args }, _, resume) =>
  fs[op](...args, (e, contents) => e
    ? resume.throw(e) : resume.next(contents))

export function * readFile (path, encoding) {
  return yield ({ effect: 'File', op: 'readFile', args: [path, encoding] })
}

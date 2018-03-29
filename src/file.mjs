import fs from 'fs'
import { namedHandler } from './handler'

export const File = namedHandler('File', ({ op, args }, _, resume) =>
  fs[op](...args, (e, contents) => e
    ? resume.throw(e) : resume.next(contents)))

export function * readFile (path, encoding) {
  return yield ({ effect: 'File', op: 'readFile', args: [path, encoding] })
}

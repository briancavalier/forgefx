import fs from 'fs'

export const File = ({ op, args }, _, resume) =>
  fs[op](...args, (e, contents) => e
    ? resume.throw(e) : resume.next(contents))

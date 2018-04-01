import fs from 'fs'
import { FileEffect } from '../effect'

export const File = {
  [FileEffect]: ({ op, args }, context) =>
    fs[op](...args, (e, contents) => e
      ? context.throw(e) : context.next(contents))
}

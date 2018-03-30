import { ConsoleEffect } from '../console'

export const Console = {
  [ConsoleEffect]: ({ op, args }, r, resume) =>
    resume.next(console[op](...args))
}

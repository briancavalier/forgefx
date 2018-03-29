import { namedHandler } from './handler'

export const State = namedHandler('State', (e, r, resume) => {
  switch (e.op) {
    case 'read':
      return r.hasOwnProperty(e.key)
        ? resume.next(r[e.key], r)
        : resume.throw(new Error(`no resource for key: ${e.key}`))
    case 'write':
      return resume.next(undefined, { ...r, [e.key]: e.value })
  }
})

export function * read (key) {
  return yield ({ effect: 'State', op: 'read', key })
}

export function * write (key, value) {
  return yield ({ effect: 'State', op: 'write', key, value })
}

export function * update (key, f) {
  return yield * write(key, f(yield * read(key)))
}

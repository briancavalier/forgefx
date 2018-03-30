export function * read (key) {
  return yield ({ effect: 'State', op: 'read', key })
}

export function * write (key, value) {
  return yield ({ effect: 'State', op: 'write', key, value })
}

export function * update (key, f) {
  return yield * write(key, f(yield * read(key)))
}

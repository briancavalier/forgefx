export const State = (e, r, resume) => {
  switch (e.op) {
    case 'read':
      return r.hasOwnProperty(e.key)
        ? resume.next(r[e.key], r)
        : resume.throw(new Error(`no resource for key: ${e.key}`))
    case 'write':
      return resume.next(undefined, { ...r, [e.key]: e.value })
  }
}

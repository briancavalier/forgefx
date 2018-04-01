import { StateEffect } from '../effect'

export const State = {
  [StateEffect]: (e, context) => {
    const r = context.resources
    switch (e.op) {
      case 'read':
        return r.hasOwnProperty(e.key)
          ? context.next(r[e.key], r)
          : context.throw(new Error(`no resource for key: ${e.key}`))
      case 'write':
        return context.next(undefined, { ...r, [e.key]: e.value })
    }
  }
}

export const handler = (handles, handle) =>
  ({ handles, handle })

export const namedHandler = (effect, handle) =>
  handler(e => e && e.effect === effect, handle)

export const findHandler = (x, handlers) =>
  handlers.find(h => h.handles(x))

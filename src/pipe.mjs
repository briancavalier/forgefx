export const pipe = (...ps) =>
  function * sequence (x) {
    for (const p of ps) x = yield * p(x)
    return x
  }

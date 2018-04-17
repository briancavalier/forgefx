// @flow
export type Either<A, B> =
  | { right: true, value: B }
  | { right: false, value: A }

export const right = <A, B> (value: B): Either<A, B> =>
  ({ right: true, value })

export const left = <A, B> (value: A): Either<A, B> =>
  ({ right: false, value })

export const either = <A, B, C> (ac: A => C, bc: B => C, e: Either<A, B>): C =>
  e.right ? bc(e.value) : ac(e.value)

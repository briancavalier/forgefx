// @flow
export interface Cancel {
  cancel (): void
}

export interface Cont<A> {
  return (A): void,
  throw (Error): void // TODO: parameterize error type?
}

export interface Step<A> {
  next (A): void,
  throw (Error): void // TODO: parameterize error type?
}

export type Next<Y, R> = IteratorResult<Y, R>

// An action is a computation that produces a set of effects E
// and a result A
export type Action<E, A> = Generator<E, A, any>

// Derive an Effect from its handler interface
// An Effect describes the set of operations that
// its handler implementation must provide
// TODO: Pair each key of Interface with it's
// associated arg type.
// Currently, that seems impossible in Flow, so we
// have to be less strict than we'd like.
export type Effect<Interface> = {|
  op: $Keys<Interface>,
  arg?: any // TODO: how to type?
|}

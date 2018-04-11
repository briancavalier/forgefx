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

export interface Context<S, A> extends Step<S>, Cont<A>, Cancel {}

// An action is a computation that produces a set of effects E
// and a result A
export type Action<E, A> = Generator<E, A, any>

// An Effect describes the set of operations that
// its handler implementation must provide
export interface Effect<E, O> {
  effect: E,
  op: O
}

// Derive an Effect type from an interface
// The interface must have an effect key that uniquely
// identifies the effect
export type MakeEffect<I> = Effect<$PropertyType<I, 'effect'>, $Keys<I>>

// TODO: Improve this
// Not clear how to type handlers yet
export type Handler = {
  effect: any
}

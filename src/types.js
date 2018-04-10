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

export interface Context<S, A> extends Step<S>, Cont<A>, Cancel {}

// An action is a computation that produces a set of effects E
// and a result A
export type Action<E, A> = Generator<E, A, any>

// We'll use a name to associate effect interfaces
// with handler implementations
export interface Named<E> {
  effect: E
}

// An Effect describes the set of operations that
// its handler implementation must provide
export interface Effect<E, O> extends Named<E> {
  op: $Keys<O>
}

// Derive an Effect type from an interface
// The interface must have an effect key that uniquely
// identifies the effect
export type MakeEffect<I> = Effect<$PropertyType<I, 'effect'>, $Keys<I>>

// An Op(eration) is data describing an effect operation
// to perform via an interface
export type Op<I, A> = I & { arg: A }

// TODO: Improve this
// Not clear how to type handlers yet
export type Handler = {
  effect: any
}

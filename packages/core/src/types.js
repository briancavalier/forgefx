// @flow
export type Cancel = void => void

export type Cont<A> = A => void

export type Step<A> = Cont<A>

export type Context<H, A> = {
  handler: H,
  next: Step<A>
}

export type Next<Y, R> = IteratorResult<Y, R>

export type Op<+A> = { +op: A }

// An action is a computation that produces a set of effects E
// and a result A. We use Generators as the representation to
// take advantage of a few things:
// 1. We can use generators to implement continuations in
//    similar ways to other promise-based async runners.
// 2. Flow will aggregate the Yield type of nested generators,
//    and we can use this to aggregate recursively all the
//    effects present in nested Actions.
// 3. We can use yield* as bind/flatMap, which allows
//    Actions to be nested and composed, which works incredibly
//    well and requires very little code.  The downside is
//    that `yield*` is visually wierd/noisy/ugly.
export type Action<E, A> = Generator<Op<E>, A, *>

// Derive an Effect from its handler interface
// An Effect describes the set of operations that
// its handler implementation must provide
// TODO: Pair each key of Interface with it's
// associated arg type.
// Currently, that seems impossible in Flow, so we
// have to be less strict than we'd like.
export type Effect<Interface> = $Keys<Interface>

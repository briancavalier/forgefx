# Composable effects

This is an experiment with composable effects and effectful programs.  It's basically algebraic effects and handlers, using generators as the underlying implementation of continuations.

## Try it

`node -r @babel/register ./examples/delay`

`node -r @babel/register ./examples/async-problem/index ./examples/async-problem/input`

## Highlights

* Separation of effect interfaces and implementations: program with interfaces, supply effect implementations when running programs.
* Composable effects: create new effects from existing ones.
* Composable _programs_: `yield *` can be used to compose effectful programs.
* Asynchronous effects with cancelation.

## Inspiration

* [Koka](https://github.com/koka-lang/koka)
* [Eff](http://www.eff-lang.org)
* [Scala Effekt](https://github.com/b-studios/scala-effekt)
* [Creed](https://github.com/briancavalier/creed)'s coroutine implementation

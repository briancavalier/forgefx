# Algebraic Effects and Handlers

Algebraic effects and handlers using generators.

## Try it

`node --experimental-modules ./examples/delay`

`node --experimental-modules ./examples/async-problem/index ./examples/async-problem/input`

## Highlights

* Separation of effect interfaces and implementations: program with interfaces, supply effect implementations when running programs.
* Composable effects: create new effects from existing ones.
* Composable _programs_: `yield *` can also be used to nest and compose effectful programs.
* Asynchronous effects with cancelation.

## Inspiration

* [Koka](https://github.com/koka-lang/koka)
* [Eff](http://www.eff-lang.org)
* [Scala Effekt](https://github.com/b-studios/scala-effekt)
* [Creed](https://github.com/briancavalier/creed)'s coroutine implementation

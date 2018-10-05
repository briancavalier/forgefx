// @flow
import { type Action, type Async, type Console, type Either, type Process, log, callNode, all, args } from '../../packages/core'
import path from 'path'
import fs from 'fs'

// Solving the async-problem
// See https://github.com/plaid/async-problem

const readFile = (dir: string, name: string): Action<Async, Either<Error, string>> =>
  callNode((cb) => fs.readFile(path.join(dir, name), 'utf8', cb))

const lines = (s: Either<Error, string>): string[] =>
  s.right ? s.value.split('\n').filter(s => s.length > 0) : []

export function * main (): Action<Process | Console | Async, void> {
  const dir = (yield * args()).pop()
  const contents = yield * readFile(dir, 'index.txt')
  const files = lines(contents).map(file => readFile(dir, file))
  const results = yield * all(files)
  yield * log(results)
}

// @flow
import { type Action, type Async, type Console, type Process, log, callNode, all, args } from '../..'
import path from 'path'
import fs from 'fs'

// Solving the async-problem
// See https://github.com/plaid/async-problem

const readFile = (dir: string, name: string): Action<Async, string> =>
  callNode((cb) => fs.readFile(path.join(dir, name), 'utf8', cb))

const lines = (s: string): string[] =>
  s.split('\n').filter(s => s.length > 0)

export function * main (): Action<Process | Console | Async, void> {
  const dir = (yield * args()).pop()
  const contents = yield * readFile(dir, 'index.txt')
  const files = lines(contents).map(file => readFile(dir, file))
  const results = yield * all(files)
  yield * log(results.join(''))
}

import { log, callNode, all, args } from '../../src'
import path from 'path'
import fs from 'fs'

// Solving the async-problem
// See https://github.com/plaid/async-problem

const readFile = (dir, name) =>
  callNode(fs.readFile, path.join(dir, name), 'utf8')

const lines = (s) =>
  s.split('\n').filter(s => s.length > 0)

export function * main () {
  const dir = (yield * args()).pop()
  const contents = yield * readFile(dir, 'index.txt')
  const files = lines(contents).map(file => readFile(dir, file))
  const results = yield * all(files)
  yield * log(results.join(''))
}

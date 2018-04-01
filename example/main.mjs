import { log, callNode } from '../src'
import path from 'path'
import fs from 'fs'

// Solving the async-problem
// See https://github.com/plaid/async-problem

export function * main (base) {
  const readFile = (name) => callNode((cb) => fs.readFile(path.join(base, name), 'utf8', cb))
  const contents = yield * readFile('index.txt')
  let result = ''
  for (const s of contents.split('\n')) {
    result += s ? yield * readFile(s) : ''
  }
  yield * log(result)
}

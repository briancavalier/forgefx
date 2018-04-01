import { log, readFile } from '../src'
import path from 'path'

// Solving the async-problem
// See https://github.com/plaid/async-problem

export function * main (base) {
  const contents = yield * readFile(path.join(base, 'index.txt'), 'utf8')
  let result = ''
  for (const s of contents.split('\n')) {
    result += s ? yield * readFile(path.join(base, s), 'utf8') : ''
  }
  yield * log(result)
}

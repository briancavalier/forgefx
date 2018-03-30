import { log, readFile } from '../src'

export function * main (path) {
  const contents = yield * readFile(path, 'utf8')
  yield * log(contents)
}

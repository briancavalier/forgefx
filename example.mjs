import { Console, log } from './src/console'
import { File, readFile } from './src/file'
import { run } from './src/run'

function * main (path) {
  const contents = yield * readFile(path, 'utf8')
  yield * log(contents)
}

const handlers = {Console, File}

run(handlers, main('package.json'))

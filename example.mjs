import { Console, log } from './src/console'
import { File, readFile } from './src/file'
import { spawn } from './src/run'

function * program (path) {
  const contents = yield * readFile(path, 'utf8')
  yield * log(contents)
}

const handlers = [Console, File]

spawn(handlers, program('package.json'))

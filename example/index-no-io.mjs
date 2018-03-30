import { main } from './main'
import { run } from '../src'
import { Console } from '../src/handler'

const testPackageJson = {
  name: 'test'
}

const File = ({ op, args }, resources, resume) =>
  resume.next(JSON.stringify(testPackageJson))

const handlers = {Console, File}

run(handlers, main('package.json'))

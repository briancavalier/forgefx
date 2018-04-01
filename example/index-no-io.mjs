import { main } from './main'
import { runPromise, FileEffect } from '../src'
import { Console } from '../src/handler'

const testPackageJson = {
  name: 'test'
}

const handlers = {
  ...Console,
  [FileEffect]: ({ op, args }, context) =>
    context.next(JSON.stringify(testPackageJson))
}

runPromise(handlers, main('package.json'))

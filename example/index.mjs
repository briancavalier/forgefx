import { main } from './main'
import { runPromise } from '../src'
import { Console, File } from '../src/handler'

const handlers = {...Console, ...File}

runPromise(handlers, main('package.json'))

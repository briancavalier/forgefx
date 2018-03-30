import { main } from './main'
import { run } from '../src'
import { Console, File } from '../src/handler'

const handlers = {...Console, File}

run(handlers, main('package.json'))

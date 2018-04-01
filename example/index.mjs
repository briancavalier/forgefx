import { main } from './main'
import { runPromise } from '../src'
import { Console, Async } from '../src/handler'

const handlers = {...Console, ...Async}

runPromise(handlers, main(process.argv[process.argv.length - 1]))

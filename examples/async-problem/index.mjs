import { main } from './main'
import { runPromise, Console, Async, Process } from '../../src'

const handlers = [Console, Async, Process]

runPromise(handlers, main())
  .catch(e => console.error(e))

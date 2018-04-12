// @flow
import { main } from './main'
import { runPromise, HandleConsole, HandleAsync, HandleProcess } from '../../src'

const handlers = {...HandleConsole, ...HandleAsync, ...HandleProcess}

runPromise(handlers, main())
  .catch(e => console.error(e))

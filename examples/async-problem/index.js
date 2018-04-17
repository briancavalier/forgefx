// @flow
import { main } from './main'
import { run_, HandleConsole, HandleAsync, HandleProcess } from '../..'

const handlers = {...HandleConsole, ...HandleAsync, ...HandleProcess}

run_(handlers, main())

// @flow
import { main } from './main'
import { run_, HandleConsole, HandleAsync, HandleProcess } from '../../packages/core'

const handlers = {...HandleConsole, ...HandleAsync, ...HandleProcess}

run_(handlers, main())

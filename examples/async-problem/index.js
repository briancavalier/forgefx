// @flow
import { main } from './main'
import { handle, runPure, HandleConsole, HandleAsync, HandleProcess } from '../../packages/core'

const handlers = { ...HandleConsole, ...HandleAsync, ...HandleProcess }

runPure(handle(handlers, main()))

// @flow
import { main } from './main'
import { withHandler, run_, attempt, HandleConsole, HandleAsync, HandleProcess } from '../../packages/core'

const handler = { ...HandleConsole, ...HandleAsync, ...HandleProcess }

run_(withHandler(handler, attempt(main())))

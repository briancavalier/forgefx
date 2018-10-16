// @flow
import { main } from './main'
import { withHandler, run_, recover, HandleConsole, HandleAsync, HandleProcess } from '../../packages/core'

const handler = { ...HandleConsole, ...HandleAsync, ...HandleProcess }

run_(withHandler(handler, recover(main())))

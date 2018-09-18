// @flow

import { HandleProcess, withHandler, run_ } from '../../packages/core'
import { main } from './main'

// And now we can run main with the handler implementations
run_(withHandler(HandleProcess, main()))

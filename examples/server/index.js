// @flow

import { HandleProcess, handle, runPure } from '../../packages/core'
import { main } from './main'

// And now we can run main with the handler implementations
runPure(handle(HandleProcess, main()))

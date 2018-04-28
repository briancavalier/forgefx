// @flow

import { HandleProcess, run_ } from '../../packages/core'
import { main } from './main'

// We need to provide handler implementations of the effects
// used by main. We can do that by just combining the handlers
// for each effect.
const handlers = {
  ...HandleProcess
}

// And now we can run main with the handler implementations
run_(handlers, main())

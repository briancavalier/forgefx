// @flow
import type { CoreHandler, ResumeF } from '../effect/core'
import { type Resume, resumeLater } from '../runtime'

export const HandleCore: CoreHandler = {
  'forgefx/core/suspend': <H, A> (r: Resume<H, A>): Resume<H, A> =>
    r,
  'forgefx/core/call': <H, A> (f: ResumeF<H, A>): Resume<H, A> =>
    resumeLater(f)
}

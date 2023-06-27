import { describe } from 'vitest'

import { defaultArgs, runTests } from './state.spec'

const args = { ...defaultArgs }
args.runSkipped = 'SLOW'
args['verify-test-amount-alltests'] = 0

describe(`VM State SLOW Tests`, async () => {
  await runTests(args)
})

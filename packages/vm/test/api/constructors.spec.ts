import { assert, describe, it } from 'vitest'

import { createVM } from '../../src/index.ts'

describe('[VM/Constructors]: profiler options', () => {
  it('createVM() rejects conflicting profiler report flags', async () => {
    try {
      await createVM({
        profilerOpts: {
          reportAfterBlock: true,
          reportAfterTx: true,
        },
      })
      assert.fail('should throw')
    } catch (e: unknown) {
      assert.match((e as Error).message, /reportProfilerAfterBlock/)
    }
  })
})

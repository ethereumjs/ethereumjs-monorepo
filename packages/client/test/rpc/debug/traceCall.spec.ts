import { describe, expect, it } from 'vitest'

import { createClient, createManager } from '../helpers'

const method = 'debug_traceCall'

describe(method, () => {
  const manager = createManager(createClient({}))
  const methods = manager.getMethods()
  it(' debug_traceCall method exists', async () => {
    expect(Object.keys(methods)).toContain(method)
  })
})

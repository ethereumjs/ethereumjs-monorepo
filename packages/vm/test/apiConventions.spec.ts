import { EventEmitter } from 'eventemitter3'
import { assert, describe, it } from 'vitest'

import { createVM } from '../src/index.ts'

// D-EVT-1: `events` is always defined at runtime on the VM class.
describe('API conventions: VM events always-defined (D-EVT-1)', () => {
  it('createVM().events is always a defined EventEmitter', async () => {
    const vm = await createVM()
    assert.instanceOf(vm.events, EventEmitter)
  })
})

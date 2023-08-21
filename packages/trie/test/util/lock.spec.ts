// Based on https://github.com/jsoendermann/semaphore-async-await/blob/master/__tests__/Semaphore.spec.ts
import { assert, describe, it } from 'vitest'

import { Lock } from '../../src/util/lock.js'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

describe('Lock', () => {
  it('should lock', async () => {
    let global = 0
    const lock = new Lock()

    const f = async () => {
      await lock.acquire()
      const local = global
      await wait(500)
      global = local + 1
      lock.release()
    }

    void f()
    void f()
    await wait(1500)

    assert.equal(global, 2)
  })
})

import { assert, describe, it } from 'vitest'

import { Lock } from '../src/index.js'

describe('Lock class: acquire', () => {
  it('should return true when permits are available', async () => {
    const lock = new Lock()
    const result = await lock.acquire()
    assert.equal(result, true, 'should return true')
  })

  it('should return a promise when no permits are available', async () => {
    const lock = new Lock()
    await lock.acquire()

    const result = lock.acquire()
    assert.ok(result instanceof Promise, 'should return a promise')
  })
})

describe('Lock class: acquire', () => {
  it('should increase the number of permits', () => {
    const lock = new Lock()
    lock.release()
    assert.equal(lock['permits'], 2, 'should increase permits by 1')
  })

  it('should resolve the waiting promise when permits are released', async () => {
    const lock = new Lock()
    await lock.acquire() // Start waiting

    setTimeout(() => {
      lock.release() // Release the permits after a delay
    }, 100)

    const result = await lock.acquire()
    assert.equal(result, true, 'should resolve waiting promise')
  })
})

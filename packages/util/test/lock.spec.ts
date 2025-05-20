import { assert, describe, it } from 'vitest'

import { Lock } from '../src/index.ts'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

describe('Lock class', () => {
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

    assert.strictEqual(global, 2)
  })
})

describe('Lock class: acquire', () => {
  it('should return true when permits are available', async () => {
    const lock = new Lock()
    const result = await lock.acquire()
    assert.strictEqual(result, true, 'should return true')
  })

  it('should return a promise when no permits are available', async () => {
    const lock = new Lock()
    await lock.acquire()

    const result = lock.acquire()
    assert.isTrue(result instanceof Promise, 'should return a promise')
  })
})

describe('Lock class: acquire', () => {
  it('should increase the number of permits', () => {
    const lock = new Lock()
    lock.release()
    assert.strictEqual(lock['permits'], 2, 'should increase permits by 1')
  })

  it('should resolve the waiting promise when permits are released', async () => {
    const lock = new Lock()
    await lock.acquire() // Start waiting

    setTimeout(() => {
      lock.release() // Release the permits after a delay
    }, 100)

    const result = await lock.acquire()
    assert.strictEqual(result, true, 'should resolve waiting promise')
  })
})

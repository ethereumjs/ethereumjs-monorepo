import * as tape from 'tape'

import { Lock } from '../src'

tape('Lock class', (t) => {
  t.test('acquire', (t) => {
    t.test('should return true when permits are available', async (t) => {
      const lock = new Lock()
      const result = await lock.acquire()
      t.equal(result, true, 'should return true')
    })

    t.test('should return a promise when no permits are available', async (t) => {
      const lock = new Lock()
      await lock.acquire()

      const result = lock.acquire()
      t.ok(result instanceof Promise, 'should return a promise')
      t.end()
    })
  })

  t.test('release', (t) => {
    t.test('should increase the number of permits', (t) => {
      const lock = new Lock()
      lock.release()
      t.equal(lock['permits'], 2, 'should increase permits by 1')
      t.end()
    })

    t.test('should resolve the waiting promise when permits are released', async (t) => {
      const lock = new Lock()
      await lock.acquire() // Start waiting

      setTimeout(() => {
        lock.release() // Release the permits after a delay
      }, 100)

      const result = await lock.acquire()
      t.equal(result, true, 'should resolve waiting promise')
    })
  })

  t.end()
})

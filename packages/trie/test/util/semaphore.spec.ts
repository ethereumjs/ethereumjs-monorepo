// Based on https://github.com/jsoendermann/semaphore-async-await/blob/master/__tests__/Semaphore.spec.ts
import * as tape from 'tape'

import { Semaphore } from '../../src/util/semaphore'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

tape('Semaphore', (t) => {
  t.test('should lock', async (st) => {
    let global = 0
    const lock = new Semaphore(1)

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

    st.equal(global, 2)
    st.end()
  })
  t.end()
})

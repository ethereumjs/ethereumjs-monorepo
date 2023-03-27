import * as tape from 'tape'

import { Memory } from '../src/memory'

tape('Memory', (t) => {
  const m = new Memory()
  t.test('should have 0 capacity initially', (st) => {
    st.equal(m._store.length, 0)
    st.end()
  })

  t.test('should return zeros from empty memory', (st) => {
    st.deepEquals(m.read(0, 3), Uint8Array.from([0, 0, 0]))
    st.end()
  })

  t.test('should extend capacity to 8192 bytes', (st) => {
    m.extend(0, 3)
    st.equal(m._store.length, 8192)
    st.end()
  })

  t.test('should return zeros before writing', (st) => {
    st.deepEquals(m.read(0, 2), Uint8Array.from([0, 0]))
    st.end()
  })

  t.test('should write value', (st) => {
    m.write(29, 3, Uint8Array.from([1, 2, 3]))
    st.deepEquals(m.read(29, 5), Uint8Array.from([1, 2, 3, 0, 0]))
    st.end()
  })

  t.test('should fail when value len and size are inconsistent', (st) => {
    st.throws(() => m.write(0, 5, Uint8Array.from([8, 8, 8])), /size/)
    st.end()
  })

  t.test(
    'should expand by container (8192 bytes) properly when writing to previously untouched location',
    (st) => {
      const memory = new Memory()
      st.equal(memory._store.length, 0, 'memory should start with zero length')
      memory.write(0, 1, Uint8Array.from([1]))
      st.equal(memory._store.length, 8192, 'memory buffer length expanded to 8192 bytes')

      st.end()
    }
  )

  t.test(
    'should expand by container (8192 bytes) when reading a previously untouched location',
    (st) => {
      const memory = new Memory()
      memory.read(0, 8)
      st.equal(memory._store.length, 8192)

      memory.read(8190, 8193)
      st.equal(memory._store.length, 16384)

      st.end()
    }
  )
})

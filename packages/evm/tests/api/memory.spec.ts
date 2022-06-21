import * as tape from 'tape'
import Memory from '../../src/memory'

tape('Memory', (t) => {
  const m = new Memory()
  t.test('should have 0 capacity initially', (st) => {
    st.equal(m._store.length, 0)
    st.end()
  })

  t.test('should return zeros from empty memory', (st) => {
    st.ok(m.read(0, 3).equals(Buffer.from([0, 0, 0])))
    st.end()
  })

  t.test('should extend capacity to word boundary', (st) => {
    m.extend(0, 3)
    st.equal(m._store.length, 32)
    st.end()
  })

  t.test('should return zeros before writing', (st) => {
    st.ok(m.read(0, 2).equals(Buffer.from([0, 0])))
    st.end()
  })

  t.test('should write value', (st) => {
    m.write(29, 3, Buffer.from([1, 2, 3]))
    st.ok(m.read(29, 5).equals(Buffer.from([1, 2, 3, 0, 0])))
    st.end()
  })

  t.test('should fail when value len and size are inconsistent', (st) => {
    st.throws(() => m.write(0, 5, Buffer.from([8, 8, 8])), /size/)
    st.end()
  })

  t.test(
    'should expand by word (32 bytes) properly when writing to previously untouched location',
    (st) => {
      const memory = new Memory()
      memory.write(0, 1, Buffer.from([1]))
      st.equal(memory._store.length, 32)

      memory.write(1, 3, Buffer.from([2, 2, 2]))
      st.equal(memory._store.length, 32)

      memory.write(4, 32, Buffer.allocUnsafe(32).fill(3))
      st.equal(memory._store.length, 64)

      memory.write(36, 32, Buffer.allocUnsafe(32).fill(4))
      st.equal(memory._store.length, 96)

      st.end()
    }
  )

  t.test('should expand by word (32 bytes) when reading a previously untouched location', (st) => {
    const memory = new Memory()
    memory.read(0, 8)
    st.equal(memory._store.length, 32)

    memory.read(1, 16)
    st.equal(memory._store.length, 32)

    memory.read(1, 32)
    st.equal(memory._store.length, 64)

    memory.read(32, 32)
    st.equal(memory._store.length, 64)

    memory.read(33, 32)
    st.equal(memory._store.length, 96)

    st.end()
  })
})

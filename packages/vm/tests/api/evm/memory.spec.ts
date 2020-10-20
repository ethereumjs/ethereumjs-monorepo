import tape from 'tape'
import Memory from '../../../lib/evm/memory'

tape('Memory', (t) => {
  const m = new Memory()
  t.test('should have 0 capacity initially', (st) => {
    st.equal(m._store.length, 0)
    st.throws(() => m.write(0, 3, Buffer.from([1, 2, 3])), /capacity/)
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

  t.test('should not write value beyond capacity', (st) => {
    st.throws(() => m.write(30, 3, Buffer.from([1, 2, 3])), /capacity/)
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
})

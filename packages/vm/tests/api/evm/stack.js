const tape = require('tape')
const BN = require('bn.js')
const Stack = require('../../../dist/evm/stack').default

tape('Stack', t => {
  t.test('should be empty initially', st => {
    const s = new Stack()
    st.equal(s._store.length, 0)
    st.throws(() => s.pop())
    st.end()
  })

  t.test('popN should throw for empty stack', st => {
    const s = new Stack()
    st.deepEqual(s.popN(0), [])
    st.throws(() => s.popN(1))
    st.end()
  })

  t.test('should not push invalid type values', st => {
    const s = new Stack()
    st.throws(() => s.push('str'))
    st.throws(() => s.push(5))
    st.end()
  })

  t.test('should push item', st => {
    const s = new Stack()
    s.push(new BN(5))
    st.equal(s.pop().toNumber(), 5)
    st.end()
  })

  t.test('popN should return array for n = 1', st => {
    const s = new Stack()
    s.push(new BN(5))
    st.deepEqual(s.popN(1), [new BN(5)])
    st.end()
  })

  t.test('popN should fail on underflow', st => {
    const s = new Stack()
    s.push(new BN(5))
    st.throws(() => s.popN(2))
    st.end()
  })

  t.test('popN should return in correct order', st => {
    const s = new Stack()
    s.push(new BN(5))
    s.push(new BN(7))
    st.deepEqual(s.popN(2), [new BN(7), new BN(5)])
    st.end()
  })

  t.test('should throw on overflow', st => {
    const s = new Stack()
    for (let i = 0; i < 1024; i++) {
      s.push(new BN(i))
    }
    st.throws(() => s.push(new BN(1024)))
    st.end()
  })

  t.test('should swap top with itself', st => {
    const s = new Stack()
    s.push(new BN(5))
    s.swap(0)
    st.deepEqual(s.pop(), new BN(5))
    st.end()
  })

  t.test('swap should throw on underflow', st => {
    const s = new Stack()
    s.push(new BN(5))
    st.throws(() => s.swap(1))
    st.end()
  })

  t.test('should swap', st => {
    const s = new Stack()
    s.push(new BN(5))
    s.push(new BN(7))
    s.swap(1)
    st.deepEqual(s.pop(), new BN(5))
    st.end()
  })

  t.test('dup should throw on underflow', st => {
    const s = new Stack()
    st.throws(() => st.dup(0))
    s.push(new BN(5))
    st.throws(() => st.dup(1))
    st.end()
  })

  t.test('should dup', st => {
    const s = new Stack()
    s.push(new BN(5))
    s.push(new BN(7))
    s.dup(2)
    st.deepEqual(s.pop(), new BN(5))
    st.end()
  })

  t.test('should validate value overflow', st => {
    const s = new Stack()
    const max = new BN(2).pow(new BN(256)).subn(1)
    s.push(max)
    st.deepEqual(s.pop(), max)
    st.throws(() => s.push(max.addn(1)))
    st.end()
  })
})

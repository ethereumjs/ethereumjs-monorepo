const tape = require('tape')
const Bloom = require('../../lib/bloom')
const utils = require('ethereumjs-util')

const byteSize = 256

tape('bloom', (t) => {
  t.test('should initialize without params', (st) => {
    const b = new Bloom()
    st.deepEqual(b.bitvector, utils.zeros(byteSize), 'should be empty')
    st.end()
  })

  t.test('shouldnt initialize with invalid bitvector', (st) => {
    st.throws(() => new Bloom('invalid'), /AssertionError/, 'should fail for invalid type')
    st.throws(() => new Bloom(utils.zeros(byteSize / 2), /AssertionError/), 'should fail for invalid length')
    st.end()
  })

  t.test('should contain values of hardcoded bitvector', (st) => {
    const hex = '00000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000'
    const vector = Buffer.from(hex, 'hex')

    const b = new Bloom(vector)
    st.true(b.check('value 1'), 'should contain value 1')
    st.true(b.check('value 2'), 'should contain value 2')
    st.end()
  })

  t.test('check shouldnt be tautology', (st) => {
    const b = new Bloom()
    st.false(b.check('random value'), 'should not contain random value')
    st.end()
  })

  t.test('should correctly add value', (st) => {
    const b = new Bloom()
    b.add('value')
    let found = b.check('value')
    st.true(found, 'should contain added value')
    st.end()
  })

  t.test('should check multiple values', (st) => {
    const b = new Bloom()
    b.add('value 1')
    b.add('value 2')
    let found = b.multiCheck(['value 1', 'value 2'])
    st.true(found, 'should contain both values')
    st.end()
  })

  t.test('should or two filters', (st) => {
    const b1 = new Bloom()
    b1.add('value 1')
    const b2 = new Bloom()
    b2.add('value 2')

    b1.or(b2)
    st.true(b1.check('value 2'), 'should contain value 2 after or')
    st.end()
  })
})

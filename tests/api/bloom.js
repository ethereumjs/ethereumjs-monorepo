const tape = require('tape')
const Bloom = require('../../dist/bloom').default
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
    st.true(b.check(Buffer.from('value 1', 'utf8')), 'should contain string "value 1"')
    st.true(b.check(Buffer.from('value 2', 'utf8')), 'should contain string "value 2"')
    st.end()
  })

  t.test('check shouldnt be tautology', (st) => {
    const b = new Bloom()
    st.false(b.check(Buffer.from('random value', 'utf8')), 'should not contain string "random value"')
    st.end()
  })

  t.test('should correctly add value', (st) => {
    const b = new Bloom()
    b.add(Buffer.from('value', 'utf8'))
    let found = b.check(Buffer.from('value', 'utf8'))
    st.true(found, 'should contain added value')
    st.end()
  })

  t.test('should check multiple values', (st) => {
    const b = new Bloom()
    b.add(Buffer.from('value 1', 'utf8'))
    b.add(Buffer.from('value 2', 'utf8'))
    let found = b.multiCheck([Buffer.from('value 1'), Buffer.from('value 2')])
    st.true(found, 'should contain both values')
    st.end()
  })

  t.test('should or two filters', (st) => {
    const b1 = new Bloom()
    b1.add(Buffer.from('value 1', 'utf8'))
    const b2 = new Bloom()
    b2.add(Buffer.from('value 2', 'utf8'))

    b1.or(b2)
    st.true(b1.check(Buffer.from('value 2', 'utf-8')), 'should contain "value 2" after or')
    st.end()
  })

  t.test('should generate the correct bloom filter value', (st) => {
    let bloom = new Bloom()
    bloom.add(Buffer.from('1d7022f5b17d2f8b695918fb48fa1089c9f85401', 'hex'))
    bloom.add(Buffer.from('8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', 'hex'))
    bloom.add(Buffer.from('0000000000000000000000005409ed021d9299bf6814279a6a1411a7e866a631', 'hex'))
    bloom.add(Buffer.from('0000000000000000000000001dc4c1cefef38a777b15aa20260a54e584b16c48', 'hex'))
    st.equal(
      bloom.bitvector.toString('hex'),
      '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000081100200000000000000000000000000000000000000000000000000000000008000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000002000000000000000004000000000000000000000'
    )
    st.end()
  })
})

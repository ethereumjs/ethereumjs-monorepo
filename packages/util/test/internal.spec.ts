import * as tape from 'tape'
import {
  isHexPrefixed,
  stripHexPrefix,
  padToEven,
  getBinarySize,
  arrayContainsArray,
  toAscii,
  getKeys,
  isHexString,
} from '../src/internal'

const buf = Buffer.from('hello')

tape('internal', (t) => {
  t.test('isHexPrefixed', (st) => {
    st.equal(isHexPrefixed('0xabc'), true)
    st.equal(isHexPrefixed('abc'), false)
    st.end()
  })
  t.test('stripHexPrefix', (st) => {
    st.equal(stripHexPrefix('0xabc'), 'abc')
    st.equal(stripHexPrefix('abc'), 'abc')
    st.end()
  })
  t.test('padToEven', (st) => {
    st.equal(padToEven('123'), '0123')
    st.equal(padToEven('1234'), '1234')
    st.end()
  })
  t.test('getBinarySize', (st) => {
    st.equal(getBinarySize('hello'), buf.byteLength)
    st.end()
  })
  t.test('arrayContainsArray', (st) => {
    st.equal(arrayContainsArray([1, 2, 3], [1, 2]), true)
    st.equal(arrayContainsArray([1, 2, 3], [4, 5]), false)
    st.equal(arrayContainsArray([1, 2, 3], [3, 5], true), true)
    st.equal(arrayContainsArray([1, 2, 3], [4, 5], true), false)
    st.end()
  })
  t.test('toAscii', (st) => {
    st.equal(toAscii(buf.toString('ascii')), '\x00\x00\x00')
    st.end()
  })
  t.test('getKeys', (st) => {
    st.deepEqual(
      getKeys(
        [
          { a: '1', b: '2' },
          { a: '3', b: '4' },
        ],
        'a'
      ),
      ['1', '3']
    )
    st.deepEqual(
      getKeys(
        [
          { a: '', b: '2' },
          { a: '3', b: '4' },
        ],
        'a',
        true
      ),
      ['', '3']
    )
    st.end()
  })
  t.test('isHexString', (st) => {
    st.equal(isHexString('0x0000000000000000000000000000000000000000'), true)
    st.equal(isHexString('123'), false)
    st.end()
  })
  t.end()
})

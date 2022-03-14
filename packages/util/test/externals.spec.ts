import tape from 'tape'
import * as rlp_export from 'rlp'
import * as src from '../src'

tape('External rlp export', (t) => {
  t.test('should export `rlp`', (st) => {
    st.equal(src.rlp, rlp_export)
    st.end()
  })

  t.test('should use a rlp function correctly', (st) => {
    const nestedList = [[], [[]], [[], [[]]]]
    const encoded = src.rlp.encode(nestedList)
    const decoded = src.rlp.decode(encoded)
    st.deepEqual(nestedList, decoded)
    st.end()
  })

  t.test('should throw on exceptions', (st) => {
    // bad values: wrong encoded a zero
    const val = Buffer.from(
      'f9005f030182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
      'hex'
    )
    let result
    try {
      result = src.rlp.decode(val)
    } catch (e: any) {
      // pass
    }
    st.equal(result, undefined)

    // bad values: invalid length
    const a = Buffer.from(
      'f86081000182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
      'hex'
    )

    let res
    try {
      result = src.rlp.decode(a)
    } catch (e: any) {
      // pass
    }
    st.equal(res, undefined)
    st.end()
  })
})

tape('External ethjsUtil export', (t) => {
  t.test('should have all ethjsUtil methods', (st) => {
    const expected = [
      'arrayContainsArray',
      'toBuffer',
      'intToBuffer',
      'getBinarySize',
      'stripHexPrefix',
      'isHexPrefixed',
      'padToEven',
      'intToHex',
      'fromAscii',
      'fromUtf8',
      'toAscii',
      'getKeys',
      'isHexString',
      'toUtf8',
    ]

    expected.forEach((prop) => {
      st.ok(prop in src)
    })
    st.end()
  })

  t.test('should use ethjsUtil functions correctly', (st) => {
    // should convert intToHex
    st.equal(src.intToHex(0), '0x0')

    // should convert intToHex
    const i = 6003400
    const hex = src.intToHex(i)
    st.equal(hex, '0x5b9ac8')

    // should convert a int to a buffer
    const j = 6003400
    const buf = src.intToBuffer(j)
    st.equal(buf.toString('hex'), '5b9ac8')
    st.end()
  })

  t.test('should handle exceptions and invalid inputs', (st) => {
    // should throw when invalid abi
    st.throws(() => src.getKeys([], (<unknown>3289) as string), Error)

    // should detect invalid length hex string
    st.equal(src.isHexString('0x0', 2), false)
    st.end()
  })
})

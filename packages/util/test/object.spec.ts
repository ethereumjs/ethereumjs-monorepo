import tape from 'tape'
import { zeros, defineProperties } from '../src'

tape('define', function (t) {
  const fields = [
    {
      name: 'aword',
      alias: 'blah',
      word: true,
      default: Buffer.allocUnsafe(0),
    },
    {
      name: 'empty',
      allowZero: true,
      length: 20,
      default: Buffer.allocUnsafe(0),
    },
    {
      name: 'cannotBeZero',
      allowZero: false,
      default: Buffer.from([0]),
    },
    {
      name: 'value',
      default: Buffer.allocUnsafe(0),
    },
    {
      name: 'r',
      length: 32,
      allowLess: true,
      default: zeros(32),
    },
  ]

  t.test('should trim zeros', function (st) {
    const someOb: any = {}
    defineProperties(someOb, fields)
    // Define Properties
    someOb.r = '0x00004'
    st.equal(someOb.r.toString('hex'), '04')

    someOb.r = Buffer.from([0, 0, 0, 0, 4])
    st.equal(someOb.r.toString('hex'), '04')
    st.end()
  })

  t.test("shouldn't allow wrong size for exact size requirements", function (st) {
    const someOb = {}
    defineProperties(someOb, fields)

    st.throws(function () {
      const tmp = [
        {
          name: 'mustBeExactSize',
          allowZero: false,
          length: 20,
          default: Buffer.from([1, 2, 3, 4]),
        },
      ]
      defineProperties(someOb, tmp)
    })
    st.end()
  })

  t.test('it should accept rlp encoded intial data', function (st) {
    const someOb: any = {}
    const data = {
      aword: '0x01',
      cannotBeZero: '0x02',
      value: '0x03',
      r: '0x04',
    }

    const expected = {
      aword: '0x01',
      empty: '0x',
      cannotBeZero: '0x02',
      value: '0x03',
      r: '0x04',
    }

    const expectedArray = ['0x01', '0x', '0x02', '0x03', '0x04']

    defineProperties(someOb, fields, data)
    st.deepEqual(someOb.toJSON(true), expected, 'should produce the correctly labeled object')

    const someOb2: any = {}
    const rlpEncoded = someOb.serialize().toString('hex')
    defineProperties(someOb2, fields, rlpEncoded)
    st.equal(
      someOb2.serialize().toString('hex'),
      rlpEncoded,
      'the constuctor should accept rlp encoded buffers'
    )

    const someOb3 = {}
    defineProperties(someOb3, fields, expectedArray)
    st.deepEqual(someOb.toJSON(), expectedArray, 'should produce the correctly object')
    st.end()
  })

  t.test('it should not accept invalid values in the constuctor', function (st) {
    const someOb = {}
    st.throws(function () {
      defineProperties(someOb, fields, 5)
    }, 'should throw on nonsensical data')

    st.throws(function () {
      defineProperties(someOb, fields, Array(6))
    }, 'should throw on invalid arrays')
    st.end()
  })

  t.test('alias should work ', function (st) {
    const someOb: any = {}
    const data = {
      aword: '0x01',
      cannotBeZero: '0x02',
      value: '0x03',
      r: '0x04',
    }

    defineProperties(someOb, fields, data)
    st.equal(someOb.blah.toString('hex'), '01')
    someOb.blah = '0x09'
    st.equal(someOb.blah.toString('hex'), '09')
    st.equal(someOb.aword.toString('hex'), '09')
    st.end()
  })

  t.test('alias should work #2', function (st) {
    const someOb: any = {}
    const data = { blah: '0x1' }

    defineProperties(someOb, fields, data)
    st.equal(someOb.blah.toString('hex'), '01')
    st.equal(someOb.aword.toString('hex'), '01')
    st.end()
  })
})

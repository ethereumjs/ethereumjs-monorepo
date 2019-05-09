var assert = require('assert')
var ethUtil = require('../dist/index.js')

describe('define', function () {
  const fields = [{
    name: 'aword',
    alias: 'blah',
    word: true,
    default: Buffer.allocUnsafe(0)
  }, {
    name: 'empty',
    allowZero: true,
    length: 20,
    default: Buffer.allocUnsafe(0)
  }, {
    name: 'cannotBeZero',
    allowZero: false,
    default: Buffer.from([0])
  }, {
    name: 'value',
    default: Buffer.allocUnsafe(0)
  }, {
    name: 'r',
    length: 32,
    allowLess: true,
    default: ethUtil.zeros(32)
  }]

  it('should trim zeros', function () {
    var someOb = {}
    ethUtil.defineProperties(someOb, fields)
    // Define Properties
    someOb.r = '0x00004'
    assert.equal(someOb.r.toString('hex'), '04')

    someOb.r = Buffer.from([0, 0, 0, 0, 4])
    assert.equal(someOb.r.toString('hex'), '04')
  })

  it('shouldn\'t allow wrong size for exact size requirements', function () {
    var someOb = {}
    ethUtil.defineProperties(someOb, fields)

    assert.throws(function () {
      const tmp = [{
        name: 'mustBeExactSize',
        allowZero: false,
        length: 20,
        default: Buffer.from([1, 2, 3, 4])
      }]
      ethUtil.defineProperties(someOb, tmp)
    })
  })

  it('it should accept rlp encoded intial data', function () {
    var someOb = {}
    var data = {
      aword: '0x01',
      cannotBeZero: '0x02',
      value: '0x03',
      r: '0x04'
    }

    var expected = {
      aword: '0x01',
      empty: '0x',
      cannotBeZero: '0x02',
      value: '0x03',
      r: '0x04'
    }

    var expectedArray = [
      '0x01', '0x', '0x02', '0x03', '0x04'
    ]

    ethUtil.defineProperties(someOb, fields, data)
    assert.deepEqual(someOb.toJSON(true), expected, 'should produce the correctly labeled object')

    var someOb2 = {}
    var rlpEncoded = someOb.serialize().toString('hex')
    ethUtil.defineProperties(someOb2, fields, rlpEncoded)
    assert.equal(someOb2.serialize().toString('hex'), rlpEncoded, 'the constuctor should accept rlp encoded buffers')

    var someOb3 = {}
    ethUtil.defineProperties(someOb3, fields, expectedArray)
    assert.deepEqual(someOb.toJSON(), expectedArray, 'should produce the correctly object')
  })

  it('it should not accept invalid values in the constuctor', function () {
    var someOb = {}
    assert.throws(function () {
      ethUtil.defineProperties(someOb, fields, 5)
    }, 'should throw on nonsensical data')

    assert.throws(function () {
      ethUtil.defineProperties(someOb, fields, Array(6))
    }, 'should throw on invalid arrays')
  })

  it('alias should work ', function () {
    var someOb = {}
    var data = {
      aword: '0x01',
      cannotBeZero: '0x02',
      value: '0x03',
      r: '0x04'
    }

    ethUtil.defineProperties(someOb, fields, data)
    assert.equal(someOb.blah.toString('hex'), '01')
    someOb.blah = '0x09'
    assert.equal(someOb.blah.toString('hex'), '09')
    assert.equal(someOb.aword.toString('hex'), '09')
  })

  it('alias should work #2', function () {
    var someOb = {}
    var data = { blah: '0x1' }

    ethUtil.defineProperties(someOb, fields, data)
    assert.equal(someOb.blah.toString('hex'), '01')
    assert.equal(someOb.aword.toString('hex'), '01')
  })
})

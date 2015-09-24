var assert = require('assert')
var ethUtil = require('../index.js')
var BN = require('bn.js')

describe('define', function () {
  const fields = [{
    word: true,
    default: new Buffer([])
  }, {
    name: 'empty',
    allowZero: true,
    length: 20,
    default: new Buffer([])
  }, {
    name: 'value',
    default: new Buffer([])
  }, {
    name: 'r',
    length: 32,
    allowLess: true,
    default: ethUtil.zeros(32)
  }]

  var someOb = {}
  ethUtil.defineProperties(someOb, fields)
  it('should trim zeros', function () {
    // Define Properties
    someOb.r = '0x00004'
    assert.equal(someOb.r.toString('hex'), '04')

    someOb.r = new Buffer([0, 0, 0, 0, 4])
    assert.equal(someOb.r.toString('hex'), '04')
  })

  // it('should allow empties', function(){
  //   someOb.r = '0x00004'
  //   assert.equal(someOb.r.toString('hex'), '04')

  //   someOb.r = new Buffer([0,0,0,0, 4])
  //   assert.equal(someOb.r.toString('hex'), '04')

// })
})

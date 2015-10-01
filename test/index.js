var assert = require('assert')
var ethUtils = require('../index.js')
var BN = require('bn.js')

describe('zeros function', function () {
  it('should produce lots of 0s', function () {
    var z60 = ethUtils.zeros(30)
    var zs60 = '000000000000000000000000000000000000000000000000000000000000'
    assert.equal(z60.toString('hex'), zs60)
  })
})

describe('sha3', function () {
  it('should produce a sha3', function () {
    var msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    var r = '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
    var hash = ethUtils.sha3(msg)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('sha3 without hexprefix', function () {
  it('should produce a sha3', function () {
    var msg = '3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    var r = '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
    var hash = ethUtils.sha3(msg)
    assert.notEqual(hash.toString('hex'), r)
  })
})

describe('unpad', function () {
  it('should unpad a string', function () {
    var str = '0000000006600'
    var r = ethUtils.unpad(str)
    assert.equal(r, '6600')
  })
})

describe('unpad a hex string', function () {
  it('should unpad a string', function () {
    var str = '0x0000000006600'
    var r = ethUtils.unpad(str)
    assert.equal(r, '6600')
  })
})

describe('pad', function () {
  it('should pad a Buffer', function () {
    var buf = new Buffer([9, 9])
    var padded = ethUtils.pad(buf, 3)
    assert.equal(padded.toString('hex'), '000909')
  })
})

describe('intToHex', function () {
  it('should convert a int to hex', function () {
    var i = 6003400
    var hex = ethUtils.intToHex(i)
    assert.equal(hex, '5b9ac8')
  })
})

describe('intToBuffer', function () {
  it('should convert a int to a buffer', function () {
    var i = 6003400
    var buf = ethUtils.intToBuffer(i)
    assert.equal(buf.toString('hex'), '5b9ac8')
  })
})

describe('bufferToInt', function () {
  it('should convert a int to hex', function () {
    var buf = new Buffer('5b9ac8', 'hex')
    var i = ethUtils.bufferToInt(buf)
    assert.equal(i, 6003400)
  })
})

describe('fromSigned', function () {
  it('should converts an unsigned buffer to a singed number', function () {
    var neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    var buf = new Buffer(32)
    buf.fill(0)
    buf[0] = 255

    assert.equal(ethUtils.fromSigned(buf), neg)
  })
})

describe('toUnsigned', function () {
  it('should convert a signed number to unsigned', function () {
    var neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    var hex = 'ff00000000000000000000000000000000000000000000000000000000000000'
    var num = new BN(neg)

    assert.equal(ethUtils.toUnsigned(num).toString('hex'), hex)
  })
})

describe('pubToAddress', function () {
  it('should produce an address given a public key', function () {
    var pubKey = 'f049a20000000000f0b08900000000000841b30200000000200000000d000000'
    var address = 'ef6a1274aa67f83eadf383016d584cd6185477ae'
    pubKey = new Buffer(pubKey, 'hex')
    var r = ethUtils.pubToAddress(pubKey)
    assert.equal(r.toString('hex'), address)
  })
})

describe('pubToAddress 0x', function () {
  it('should produce an address given a public key', function () {
    var pubKey = '0xf049a20000000000f0b08900000000000841b30200000000200000000d000000'
    var address = 'ef6a1274aa67f83eadf383016d584cd6185477ae'
    var r = ethUtils.pubToAddress(pubKey)
    assert.equal(r.toString('hex'), address)
  })
})

describe('generateAddress', function () {
  it('should produce an address given a public key', function () {
    var add = ethUtils.generateAddress('990ccf8a0de58091c028d6ff76bb235ee67c1c39', 14).toString('hex')
    assert.notEqual(add.toString('hex'), 'd658a4b8247c14868f3c512fa5cbb6e458e4a989')
  })
})

describe('generateAddress with hex prefix', function () {
  it('should produce an address given a public key', function () {
    var add = ethUtils.generateAddress('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39', 14).toString('hex')
    assert.equal(add.toString('hex'), 'd658a4b8247c14868f3c512fa5cbb6e458e4a989')
  })
})

describe('hex prefix', function () {
  var string = 'd658a4b8247c14868f3c512fa5cbb6e458e4a989'
  it(' should add', function () {
    assert.equal(ethUtils.addHexPrefix(string), '0x' + string)
  })
})

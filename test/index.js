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
    var r = '22ae1937ff93ec72c4d46ff3e854661e3363440acd6f6e4adf8f1a8978382251'
    var hash = ethUtils.sha3(msg)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('sha3-512', function () {
  it('should produce a sha3', function () {
    var msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    var r = '36fdacd0339307068e9ed191773a6f11f6f9f99016bd50f87fd529ab7c87e1385f2b7ef1ac257cc78a12dcb3e5804254c6a7b404a6484966b831eadc721c3d24'
    var hash = ethUtils.sha3(msg, 512)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('sha256', function () {
  it('should produce a sha256', function () {
    var msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    var r = '58bbda5e10bc11a32d808e40f9da2161a64f00b5557762a161626afe19137445'
    var hash = ethUtils.sha256(msg)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('ripemd160', function () {
  it('should produce a ripemd160', function () {
    var msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    var r = '4bb0246cbfdfddbe605a374f1187204c896fabfd'
    var hash = ethUtils.ripemd160(msg)
    assert.equal(hash.toString('hex'), r)
  })

  it('should produce a padded ripemd160', function () {
    var msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    var r = '0000000000000000000000004bb0246cbfdfddbe605a374f1187204c896fabfd'
    var hash = ethUtils.ripemd160(msg, true)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('rlphash', function () {
  it('should produce a sha3 of the rlp data', function () {
    var msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    var r = '33f491f24abdbdbf175e812b94e7ede338d1c7f01efb68574acd279a15a39cbe'
    var hash = ethUtils.rlphash(msg)
    assert.equal(hash.toString('hex'), r)
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
  it('should left pad a Buffer', function () {
    var buf = new Buffer([9, 9])
    var padded = ethUtils.setLength(buf, 3)
    assert.equal(padded.toString('hex'), '000909')
  })
  it('should left truncate a Buffer', function () {
    var buf = new Buffer([9, 0, 9])
    var padded = ethUtils.setLength(buf, 2)
    assert.equal(padded.toString('hex'), '0009')
  })
  it('should left pad a Buffer - alias', function () {
    var buf = new Buffer([9, 9])
    var padded = ethUtils.setLengthLeft(buf, 3)
    assert.equal(padded.toString('hex'), '000909')
  })
})

describe('rpad', function () {
  it('should right pad a Buffer', function () {
    var buf = new Buffer([9, 9])
    var padded = ethUtils.setLength(buf, 3, true)
    assert.equal(padded.toString('hex'), '090900')
  })
  it('should right truncate a Buffer', function () {
    var buf = new Buffer([9, 0, 9])
    var padded = ethUtils.setLength(buf, 2, true)
    assert.equal(padded.toString('hex'), '0900')
  })
  it('should right pad a Buffer - alias', function () {
    var buf = new Buffer([9, 9])
    var padded = ethUtils.setLengthRight(buf, 3)
    assert.equal(padded.toString('hex'), '090900')
  })
})

describe('intToHex', function () {
  it('should convert a int to hex', function () {
    var i = 6003400
    var hex = ethUtils.intToHex(i)
    assert.equal(hex, '0x5b9ac8')
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
    assert.equal(ethUtils.bufferToInt(new Buffer([])), 0)
  })
  it('should convert empty input to 0', function () {
    assert.equal(ethUtils.bufferToInt(new Buffer([])), 0)
  })
})

describe('fromSigned', function () {
  it('should convert an unsigned (negative) buffer to a singed number', function () {
    var neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    var buf = new Buffer(32)
    buf.fill(0)
    buf[0] = 255

    assert.equal(ethUtils.fromSigned(buf), neg)
  })
  it('should convert an unsigned (positive) buffer to a singed number', function () {
    var neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    var buf = new Buffer(32)
    buf.fill(0)
    buf[0] = 1

    assert.equal(ethUtils.fromSigned(buf), neg)
  })
})

describe('toUnsigned', function () {
  it('should convert a signed (negative) number to unsigned', function () {
    var neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    var hex = 'ff00000000000000000000000000000000000000000000000000000000000000'
    var num = new BN(neg)

    assert.equal(ethUtils.toUnsigned(num).toString('hex'), hex)
  })

  it('should convert a signed (positive) number to unsigned', function () {
    var neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    var hex = '0100000000000000000000000000000000000000000000000000000000000000'
    var num = new BN(neg)

    assert.equal(ethUtils.toUnsigned(num).toString('hex'), hex)
  })
})

describe('publicToAddress', function () {
  it('should produce an address given a public key', function () {
    var pubKey = '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    var address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    pubKey = new Buffer(pubKey, 'hex')
    var r = ethUtils.publicToAddress(pubKey)
    assert.equal(r.toString('hex'), address)
  })
  it('should produce an address given a SEC1 public key', function () {
    var pubKey = '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    var address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    pubKey = new Buffer(pubKey, 'hex')
    var r = ethUtils.publicToAddress(pubKey, true)
    assert.equal(r.toString('hex'), address)
  })
  it('shouldn\'t produce an address given an invalid SEC1 public key', function () {
    var pubKey = '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    pubKey = new Buffer(pubKey, 'hex')
    assert.throws(function () {
      ethUtils.publicToAddress(pubKey, true)
    })
  })
  it('shouldn\'t produce an address given an invalid public key', function () {
    var pubKey = '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744'
    pubKey = new Buffer(pubKey, 'hex')
    assert.throws(function () {
      ethUtils.publicToAddress(pubKey)
    })
  })
})

describe('publicToAddress 0x', function () {
  it('should produce an address given a public key', function () {
    var pubKey = '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    var address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    var r = ethUtils.publicToAddress(pubKey)
    assert.equal(r.toString('hex'), address)
  })
})

describe('privateToPublic', function () {
  it('should produce a public key given a private key', function () {
    var pubKey = '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    var privateKey = new Buffer([234, 84, 189, 197, 45, 22, 63, 136, 201, 58, 176, 97, 87, 130, 207, 113, 138, 46, 251, 158, 81, 167, 152, 154, 171, 27, 8, 6, 126, 156, 28, 95])
    var r = ethUtils.privateToPublic(privateKey).toString('hex')
    assert.equal(r.toString('hex'), pubKey)
  })
  it('shouldn\'t produce a public key given an invalid private key', function () {
    var privateKey1 = new Buffer([234, 84, 189, 197, 45, 22, 63, 136, 201, 58, 176, 97, 87, 130, 207, 113, 138, 46, 251, 158, 81, 167, 152, 154, 171, 27, 8, 6, 126, 156, 28, 95, 42])
    var privateKey2 = new Buffer([234, 84, 189, 197, 45, 22, 63, 136, 201, 58, 176, 97, 87, 130, 207, 113, 138, 46, 251, 158, 81, 167, 152, 154, 171, 27, 8, 6, 126, 156, 28])
    assert.throws(function () {
      ethUtils.privateToPublic(privateKey1)
    })
    assert.throws(function () {
      ethUtils.privateToPublic(privateKey2)
    })
  })
})

describe('privateToAddress', function () {
  it('should produce an address given a private key', function () {
    var address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    // Our private key
    var privateKey = new Buffer([234, 84, 189, 197, 45, 22, 63, 136, 201, 58, 176, 97, 87, 130, 207, 113, 138, 46, 251, 158, 81, 167, 152, 154, 171, 27, 8, 6, 126, 156, 28, 95])
    var r = ethUtils.privateToAddress(privateKey).toString('hex')
    assert.equal(r.toString('hex'), address)
  })
})

describe('generateAddress', function () {
  it('should produce an address given a public key', function () {
    var add = ethUtils.generateAddress('990ccf8a0de58091c028d6ff76bb235ee67c1c39', 14).toString('hex')
    assert.equal(add.toString('hex'), '936a4295d8d74e310c0c95f0a63e53737b998d12')
  })
})

describe('generateAddress with hex prefix', function () {
  it('should produce an address given a public key', function () {
    var add = ethUtils.generateAddress('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39', 14).toString('hex')
    assert.equal(add.toString('hex'), 'd658a4b8247c14868f3c512fa5cbb6e458e4a989')
  })
})

describe('generateAddress with nonce 0 (special case)', function () {
  it('should produce an address given a public key', function () {
    var add = ethUtils.generateAddress('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39', 0).toString('hex')
    assert.equal(add.toString('hex'), 'bfa69ba91385206bfdd2d8b9c1a5d6c10097a85b')
  })
})

describe('hex prefix', function () {
  var string = 'd658a4b8247c14868f3c512fa5cbb6e458e4a989'
  it('should add', function () {
    assert.equal(ethUtils.addHexPrefix(string), '0x' + string)
  })
  it('should return on non-string input', function () {
    assert.equal(ethUtils.addHexPrefix(1), 1)
  })
})

describe('isPrecompiled', function () {
  it('should return true', function () {
    assert.equal(ethUtils.isPrecompiled('0000000000000000000000000000000000000001'), true)
    assert.equal(ethUtils.isPrecompiled('0000000000000000000000000000000000000002'), true)
    assert.equal(ethUtils.isPrecompiled('0000000000000000000000000000000000000003'), true)
    assert.equal(ethUtils.isPrecompiled('0000000000000000000000000000000000000004'), true)
  })
  it('should return false', function () {
    assert.equal(ethUtils.isPrecompiled('0000000000000000000000000000000000000000'), false)
    assert.equal(ethUtils.isPrecompiled('0000000000000000000000000000000000000005'), false)
    assert.equal(ethUtils.isPrecompiled('1000000000000000000000000000000000000000'), false)
  })
})

describe('toBuffer', function () {
  it('should work', function () {
    // Buffer
    assert.deepEqual(ethUtils.toBuffer(new Buffer([])), new Buffer([]))
    // Array
    assert.deepEqual(ethUtils.toBuffer([]), new Buffer([]))
    // String
    assert.deepEqual(ethUtils.toBuffer('11'), new Buffer([49, 49]))
    assert.deepEqual(ethUtils.toBuffer('0x11'), new Buffer([17]))
    assert.deepEqual(ethUtils.toBuffer('1234').toString('hex'), '31323334')
    assert.deepEqual(ethUtils.toBuffer('0x1234').toString('hex'), '1234')
    // Number
    assert.deepEqual(ethUtils.toBuffer(1), new Buffer([1]))
    // null
    assert.deepEqual(ethUtils.toBuffer(null), new Buffer([]))
    // undefined
    assert.deepEqual(ethUtils.toBuffer(), new Buffer([]))
    // 'toArray'
    assert.deepEqual(ethUtils.toBuffer(new BN(1)), new Buffer([1]))
  })
  it('should fail', function () {
    assert.throws(function () {
      ethUtils.toBuffer({ test: 1 })
    })
  })
})

describe('baToJSON', function () {
  it('should turn a array of buffers into a pure json object', function () {
    var ba = [new Buffer([0]), new Buffer([1]), [new Buffer([2])]]
    assert.deepEqual(ethUtils.baToJSON(ba), ['0x00', '0x01', ['0x02']])
  })
  it('should turn a buffers into string', function () {
    assert.deepEqual(ethUtils.baToJSON(new Buffer([0])), '0x00')
  })
})

var echash = new Buffer('82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28', 'hex')
var ecprivkey = new Buffer('3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1', 'hex')

describe('ecsign', function () {
  it('should produce a signature', function () {
    var sig = ethUtils.ecsign(echash, ecprivkey)
    assert.deepEqual(sig.r, new Buffer('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex'))
    assert.deepEqual(sig.s, new Buffer('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex'))
    assert.equal(sig.v, 27)
  })
})

describe('ecrecover', function () {
  it('should recover a public key', function () {
    var r = new Buffer('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    var s = new Buffer('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    var pubkey = ethUtils.ecrecover(echash, 27, r, s)
    assert.deepEqual(pubkey, ethUtils.privateToPublic(ecprivkey))
  })
  it('should fail on an invalid signature (v)', function () {
    var r = new Buffer('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    var s = new Buffer('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.throws(function () {
      ethUtils.ecrecover(echash, 21, r, s)
    })
  })
  it('should fail on an invalid signature (swapped points)', function () {
    var r = new Buffer('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    var s = new Buffer('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.throws(function () {
      ethUtils.ecrecover(echash, 27, s, r)
    })
  })
})

var assert = require('assert');
var ethUtils = require('../index.js');
var BN = require('bn.js');

describe('zeros function', function(){
  it('should produce lots of 0s', function(){
    var z60 = ethUtils.zeros(30);
    var zs60 = '000000000000000000000000000000000000000000000000000000000000';
    assert.equal(z60.toString('hex'), zs60);
  });
});

describe('sha3', function(){
  it('should produce a sha3', function(){
    var msg = 'There is no thing as uncoded messages';
    var r = '363e8cfe97b1ccb4a29f327fed56197c3afe391f928381d6df2e84f9683154b3';
    var hash = ethUtils.sha3(msg);
    assert.equal(hash.toString('hex'), r);
  });
});

describe('unpad', function(){
  it('should unpad a string', function(){
    var str = '0000000006600';
    var r = ethUtils.unpad(str);
    assert.equal(r, '6600');
  });
});

describe('pad', function () {
  it('should pad a Buffer', function(){
    var buf = new Buffer([9,9]);
    var padded = ethUtils.pad(buf, 3);
    assert.equal(padded.toString('hex'), '000909');
  });
});

describe('intToHex', function () {
  it('should convert a int to hex', function(){
    var i = 6003400;
    var hex = ethUtils.intToHex(i);
    assert.equal(hex, '5b9ac8');
  });
});

describe('intToBuffer', function () {
  it('should convert a int to a buffer', function(){
    var i = 6003400;
    var buf = ethUtils.intToBuffer(i);
    assert.equal(buf.toString('hex'), '5b9ac8');
  });
});

describe('bufferToInt', function () {
  it('should convert a int to hex', function(){
    var buf = new Buffer('5b9ac8', 'hex');
    var i = ethUtils.bufferToInt(buf);
    assert.equal(i, 6003400);
  });
});

describe('fromSigned', function () {
  it('should converts an unsigned buffer to a singed number', function(){
    var neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656';
    var buf = new Buffer(32);
    buf.fill(0);
    buf[0] = 255;

    assert.equal(ethUtils.fromSigned(buf), neg);
  });
});

describe('toUnsigned', function () {
  it('should convert a signed number to unsigned', function(){
    var neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656';
    var hex = 'ff00000000000000000000000000000000000000000000000000000000000000';
    var num = new BN(neg);

    assert.equal(ethUtils.toUnsigned(num).toString('hex'), hex);
  });
});

describe('pubToAddress', function () {
  it('should produce an address given a public key', function(){
    var pubKey = 'f049a20000000000f0b08900000000000841b30200000000200000000d000000';
    var address = 'ef6a1274aa67f83eadf383016d584cd6185477ae';
    pubKey = new Buffer(pubKey, 'hex');
    var r = ethUtils.pubToAddress(pubKey);
    assert.equal(r.toString('hex'), address);
  });
});


var assert = require('assert');
var fs = require('fs');
var Bignum = require('bignum');
var RLP = require('../index.js');

describe('RLP encoding (string):', function() {
    it('should return itself if single byte and less than 0x7f:', function() {
        var encodedSelf = RLP.encode('a');
        assert.equal(encodedSelf.toString(), 'a');
    });

    it('length of string 0-55 should return (0x80+len(data)) plus data', function() {
        var encodedDog = RLP.encode('dog');
        assert.equal(4, encodedDog.length);
        assert.equal(encodedDog[0], 131);
        assert.equal(encodedDog[1], 100);
        assert.equal(encodedDog[2], 111);
        assert.equal(encodedDog[3], 103);
    });

    it('length of string >55 should return 0xb7+len(len(data)) plus len(data) plus data', function() {
        var encodedLongString = RLP.encode('zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss');
        assert.equal(72, encodedLongString.length);
        assert.equal(encodedLongString[0], 184);
        assert.equal(encodedLongString[1], 70);
        assert.equal(encodedLongString[2], 122);
        assert.equal(encodedLongString[3], 111);
        assert.equal(encodedLongString[12], 53);
    });
});

describe('RLP encoding (list):', function() {
    it('length of list 0-55 should return (0xc0+len(data)) plus data', function() {
        var encodedArrayOfStrings = RLP.encode(['dog', 'god', 'cat']);
        assert.equal(13, encodedArrayOfStrings.length);
        assert.equal(encodedArrayOfStrings[0], 204);
        assert.equal(encodedArrayOfStrings[1], 131);
        assert.equal(encodedArrayOfStrings[11], 97);
        assert.equal(encodedArrayOfStrings[12], 116);
    });

    it('length of list >55 should return 0xf7+len(len(data)) plus len(data) plus data', function() {
        //need a test case here!
    });
});

describe('RLP encoding (integer):', function() {
    it('length of int = 1, less than 0x7f, similar to string', function() {
        var encodedNumber = RLP.encode(15);
        assert.equal(1, encodedNumber.length);
        assert.equal(encodedNumber[0], 15);
    });

    it('length of int > 55, similar to string', function() {
        var encodedNumber = RLP.encode(1024);
        assert.equal(3, encodedNumber.length);
        assert.equal(encodedNumber[0], 130);
        assert.equal(encodedNumber[1], 4);
        assert.equal(encodedNumber[2], 0);
    });
});

describe('RLP decoding (string):', function() {
    it('first byte < 0x7f, return byte itself', function() {
        var decodedStr = RLP.decode(new Buffer([97]));
        assert.equal(1, decodedStr.length);
        assert.equal(decodedStr.toString(), "a");
    });

    it('first byte < 0xb7, data is everything except first byte', function() {
        var decodedStr = RLP.decode(new Buffer([131, 100, 111, 103]));
        assert.equal(3, decodedStr.length);
        assert.equal(decodedStr.toString(), "dog");
    });

    it('array', function() {
        var decodedBufferArray = RLP.decode(new Buffer([204, 131, 100, 111, 103, 131, 103, 111, 100, 131, 99, 97, 116]));
        assert.deepEqual(decodedBufferArray, [new Buffer("dog"), new Buffer("god"), new Buffer("cat")]);
    });
});

describe('RLP decoding (int):', function() {
    it('first byte < 0x7f, return itself', function() {
        var decodedSmallNum = RLP.decode(new Buffer([15]));
        assert.equal(1, decodedSmallNum.length);
        assert.equal(decodedSmallNum[0], 15);
    });

    it('first byte < 0xb7, data is everything except first byte', function() {
        var decodedNum = RLP.decode(new Buffer([130, 4, 0]));
        assert.equal(2, decodedNum.length);
        assert.equal(decodedNum.toString('hex'), "0400");
    });
});

describe('strings over 55 bytes long', function(){
    var testString = "This function takes in a data, convert it to buffer if not, and a length for recursion";
    var encoded = null;
    it("should encode it", function(){
        encoded = RLP.encode(testString);
        assert.equal(encoded[0], 184);
        assert.equal(encoded[1], 86);
    });
    
    it("should decode", function(){
        var decoded = RLP.decode(encoded);
        assert.equal(decoded.toString(), testString);
    });

});

describe('list over 55 bytes long', function(){
    var testString = ["This", "function", "takes", "in", "a", "data", "convert", "it", "to", "buffer", "if", "not", "and", "a", "length", "for", "recursion", 'a1' , 'a2', 'a3', 'ia4', 'a5', 'a6', 'a7', 'a8', 'ba9'];
    var encoded = null;
    it("should encode it", function(){
        encoded = RLP.encode(testString);
    });
    
    it("should decode", function(){
        var decoded = RLP.decode(encoded);
        for(var i = 0; i < decoded.length; i++){
            decoded[i] = decoded[i].toString();
        }
        assert.deepEqual(decoded, testString);
    });

});

describe('nested lists:', function() {
    var nestedList = [ [], [[]], [ [], [[]] ] ];
    var encoded;
    it('encode a nested list', function() {
        encoded = RLP.encode(nestedList);
        assert.deepEqual(encoded, new Buffer([ 0xc7, 0xc0, 0xc1, 0xc0, 0xc3, 0xc0, 0xc1, 0xc0 ]));
    });

    it('should decode a nested list', function(){
        var decoded = RLP.decode(encoded);
        assert.deepEqual(nestedList, decoded);
    });
});

describe('null values', function() {
    var nestedList = [new Buffer(0)];
    var encoded;
    it('encode a null array', function() {
        encoded = RLP.encode(nestedList);
        assert.deepEqual(encoded, new Buffer([ 0xc1, 0x80 ]));
    });
});


describe('offical tests', function () {
    var jsonTests;
    before(function () {
        var data = fs.readFileSync('./test/jsonTests/rlptest.json')
        jsonTests = JSON.parse(data);
    });

    it('pass all tests', function (done) {
        for (test in jsonTests) {
            console.log(test);

            var incoming  = jsonTests[test].in 
            //if we are testing a big number
            if(incoming[0] == '#'){
                var bn = new Bignum(incoming.slice(1));
                incoming = bn.toBuffer()
            }

            var encoded = RLP.encode(incoming);
            assert.equal(encoded.toString('hex'), jsonTests[test].out.toLowerCase());
        }
        done();
    });
});

const assert = require('assert')

/**
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * This function takes in a data, convert it to buffer if not, and a length for recursion
 *
 * @param {Buffer,String,Integer,Array} data - will be converted to buffer
 * @returns {Buffer} - returns buffer of encoded data
 **/
exports.encode = function (input) {
  if (input instanceof Array) {
    var output = []
    for (var i=0; i < input.length; i++) {
      output.push(exports.encode(input[i]))
    }
    var buf = Buffer.concat(output)
    return Buffer.concat([encodeLength(buf.length, 192), buf])
  } else {
    input = toBuffer(input)
    if (input.length === 1 && input[0] < 128)
      return input
    else
      return Buffer.concat([encodeLength(input.length, 128), input])
  }
}

function safeParseInt(v, base){
  if(v.slice(0, 2) === '00')
    throw('invalid RLP: extra zeros')

  return parseInt(v, base)
}

function encodeLength(len, offset) {
  if (len < 56) {
    return new Buffer([len + offset])
  } else {
    var hexLength = intToHex(len)
    var lLength = hexLength.length / 2
    var firstByte = intToHex(offset + 55 + lLength)
    return new Buffer(firstByte + hexLength, 'hex')
  }
}

/**
 * RLP Decoding based on: {@link https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP|RLP}
 *
 * @param {Buffer,String,Integer,Array} data - will be converted to buffer
 * @returns {Array} - returns decode Array of Buffers containg the original message
 **/
var decode = exports.decode = function (input) {
  if(!input || input.length === 0)
    return new Buffer([])

  input = toBuffer(input)
  var decoded = _decode(input)
  assert.equal(decoded.remainder.length, 0, 'invalid remainder')
  return decoded.data
}

function _decode (input) {
  var firstByte = input[0]
  if (firstByte <= 0x7f) {
    //a single byte whose value is in the [0x00, 0x7f] range, that byte is its own RLP encoding.
    return {
      data: input.slice(0, 1),
      remainder: input.slice(1)
    }
  } else if (firstByte <= 0xb7) {
    //string is 0-55 bytes long. A single byte with value 0x80 plus the length of the string followed by the string
    //The range of the first byte is [0x80, 0xb7]
    var length = firstByte - 0x7f,
      data

    //set 0x80 null to 0
    if (firstByte === 0x80) 
      data = new Buffer([])
    else 
      data = input.slice(1, length)

    if(length === 2 && data[0] < 0x80)
      throw 'invalid rlp encoding: byte must be less 0x80'

    return {
      data: data,
      remainder: input.slice(length)
    }
  } else if (firstByte <= 0xbf) {
    var llength = firstByte - 0xb6
    var length = safeParseInt(input.slice(1, llength).toString('hex'), 16)
    var data = input.slice(llength, length + llength)
    if(data.length < length) 
      throw(new Error('invalid RLP'))

    return {
      data: data,
      remainder: input.slice(length + llength)
    }
  } else if (firstByte <= 0xf7) {
    //a list between  0-55 bytes long
    var length = firstByte - 0xbf
    var remainder = input.slice(1)
    var innerRemainder = input.slice(1, length)
    var decoded = []
    while (innerRemainder.length) {
      var d = _decode(innerRemainder)
      decoded.push(d.data)
      innerRemainder = d.remainder
    }

    return {
      data: decoded,
      remainder: input.slice(length)
    }

  } else {
    //a list  over 55 bytes long
    var llength = firstByte - 0xf6
    var length = safeParseInt(input.slice(1, llength).toString('hex'), 16)
    var totalLength = llength + length
    if(totalLength > input.length)
      throw new Error('invalid rlp: total length is larger than the data')

    var remainder = input.slice(llength)
    var innerRemainder = input.slice(llength, totalLength)
    var decoded = []
    if(innerRemainder.length === 0)
      throw new Error('invalid rlp, List has a invalid length')

    while (innerRemainder.length) {
      var d = _decode(innerRemainder)
      decoded.push(d.data)
      innerRemainder = d.remainder
    }
    return {
      data: decoded,
      remainder: input.slice(totalLength)
    }
  }
}

function intToHex (i) {
  var hex = i.toString(16)
  if (hex.length % 2) 
    hex = '0' + hex
  
  return hex
}

function toBuffer (input) {
  if (Buffer.isBuffer(input)) {
    if (input.length === 0) 
      return toBuffer(null)
    else 
      return input
  } else if (input === null || input === 0 || input === undefined) {
    return new Buffer(0)
  } else if (!isNaN(input)) {
    var hex = intToHex(input)
    return new Buffer(hex, 'hex')
  } else if (!Buffer.isBuffer(input))
    return new Buffer(input.toString())
}

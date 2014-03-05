var internals = {};

/**
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * This function takes in a data, convert it to buffer if not, and a length for recursion
 *
 * @param {Buffer,String,Integer,Array} data - will be converted to buffer
 * @returns {Buffer} - returns buffer of encoded data
 **/
internals.encode = exports.encode = function(input) {
    if (input instanceof Array) {
        var output = [];
        for (var i in input) {
            output.push(internals.encode(input[i]));
        }
        var buf = Buffer.concat(output);
        return Buffer.concat([internals.encodeLength(buf.length, 192), buf]);
    } else {
        input = internals.toBuffer(input);
        if (input.length == 1 && input[0] < 128) {
            return input;
        } else {
            return Buffer.concat([internals.encodeLength(input.length, 128), input]);
        }
    }
};

internals.encodeLength = function(len, offset) {
    if (len < 56) {
        return new Buffer([len + offset]);
    } else {
        var hL = internals.intToHex(len);
        var LL = Math.ceil((hL.length / 2));
        var firstByte = internals.intToHex(offset + 55 + LL);
        return new Buffer(firstByte + hL, 'hex');
    }
};

/**
 * RLP Decoding based on: {@link https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP|RLP}
 *
 * @param {Buffer,String,Integer,Array} data - will be converted to buffer
 * @returns {Array} - returns decode Array of Buffers containg the original message
 **/
exports.decode = function(input) {
    var input = internals.toBuffer(input);
    return internals._decode(input).data;
};

internals._decode = function(input) {
    var firstByte = input[0];
    if (firstByte <= 0x7f) {
        return {
            data: input.slice(0, 1),
            remainder: input.slice(1)
        };
    } else if (firstByte <= 0xb7) {
        var length = firstByte - 0x7f;
        return {
            data: input.slice(1, length),
            remainder: input.slice(length)
        };

    } else if (firstByte <= 0xbf) {
        var llength = firstByte - 0xb6;
        var length = parseInt(input.slice(1, llength).toString('hex'), 16);
        return {
            data: input.slice(llength, length + llength),
            remainder: input.slice(length + llength)
        };

    } else if (firstByte <= 0xf7) {
        //a list between  0-55 bytes long
        var length = firstByte - 0xbf;
        var remainder = input.slice(1);
        var innerRemainder = input.slice(1, length);
        var decoded = [];
        while (innerRemainder.length) {
            var d = internals._decode(innerRemainder);
            decoded.push(d.data);
            innerRemainder = d.remainder;
        }

        return {
            data: decoded,
            remainder: input.slice(length)
        };

    } else {
        //a list  over 55 bytes long
        var llength = firstByte - 0xf6;
        var length = parseInt(input.slice(1, llength).toString('hex'), 16);
        var remainder = input.slice(llength);
        var innerRemainder = input.slice(llength, llength + length);
        var decoded = [];
        while (innerRemainder.length) {
            var d = internals._decode(innerRemainder);
            decoded.push(d.data);
            innerRemainder = d.remainder;
        }
        return {
            data: decoded,
            remainder: input.slice(llength + length)
        };
    }
};

internals.intToHex = function(i) {
    var hex = i.toString(16);
    if (hex.length % 2) {
        hex = '0' + hex;
    }
    return hex;
};

internals.toBuffer = function(input) {
    if (!isNaN(input)) {
        var hex = internals.intToHex(input);
        input = new Buffer(hex, 'hex');
    } else if (!Buffer.isBuffer(input)) {
        input = new Buffer(input.toString());
    }
    return input;
};

//This provides SHA3 alterntive for browsers
//it will autmatically be used if this module is browserified

var sha3 = require('crypto-js/sha3'),
encHex = require("crypto-js/enc-hex");

var hash = function () {
  this.content = '';
};

hash.prototype.update = function (i) {
  this.content = Buffer.isBuffer(i) ? encHex.parse(i.toString('hex')) : i;
};

hash.prototype.digest = function () {
  return sha3(this.content, {
    outputLength: 256
  }).toString();
};

module.exports = {
  SHA3Hash: hash
};

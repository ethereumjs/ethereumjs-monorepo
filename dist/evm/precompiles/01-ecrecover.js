'use strict';

var utils = require('ethereumjs-util');
var BN = utils.BN;
var error = require('../../exceptions.js').ERROR;
var assert = require('assert');

module.exports = function (opts) {
  assert(opts.data);

  var results = {};

  results.gasUsed = new BN(opts._common.param('gasPrices', 'ecRecover'));

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0);
    results.gasUsed = opts.gasLimit;
    results.exception = 0; // 0 means VM fail (in this case because of OOG)
    results.exceptionError = error.OUT_OF_GAS;
    return results;
  }

  var data = utils.setLengthRight(opts.data, 128);

  var msgHash = data.slice(0, 32);
  var v = data.slice(32, 64);
  var r = data.slice(64, 96);
  var s = data.slice(96, 128);

  var publicKey;
  try {
    publicKey = utils.ecrecover(msgHash, new BN(v).toNumber(), r, s);
  } catch (e) {
    results.return = Buffer.alloc(0);
    results.exception = 1;
    return results;
  }

  results.return = utils.setLengthLeft(utils.publicToAddress(publicKey), 32);
  results.exception = 1;

  return results;
};
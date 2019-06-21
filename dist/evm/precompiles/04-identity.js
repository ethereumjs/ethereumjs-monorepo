'use strict';

var utils = require('ethereumjs-util');
var BN = utils.BN;
var error = require('../../exceptions.js').ERROR;
var assert = require('assert');

module.exports = function (opts) {
  assert(opts.data);

  var results = {};
  var data = opts.data;

  results.gasUsed = new BN(opts._common.param('gasPrices', 'identity'));
  results.gasUsed.iadd(new BN(opts._common.param('gasPrices', 'identityWord')).imuln(Math.ceil(data.length / 32)));

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0);
    results.gasUsed = opts.gasLimit;
    results.exceptionError = error.OUT_OF_GAS;
    results.exception = 0; // 0 means VM fail (in this case because of OOG)
    return results;
  }

  results.return = data;
  results.exception = 1;

  return results;
};
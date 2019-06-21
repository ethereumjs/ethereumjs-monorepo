'use strict';

var utils = require('ethereumjs-util');
var BN = utils.BN;
var error = require('../../exceptions.js').ERROR;
var assert = require('assert');

var bn128 = require('rustbn.js');

module.exports = function (opts) {
  assert(opts.data);

  var results = {};
  var inputData = opts.data;

  results.gasUsed = new BN(opts._common.param('gasPrices', 'ecAdd'));
  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0);
    results.exception = 0;
    results.gasUsed = new BN(opts.gasLimit);
    results.exceptionError = error.OUT_OF_GAS;
    return results;
  }

  var returnData = bn128.add(inputData);

  // check ecadd success or failure by comparing the output length
  if (returnData.length !== 64) {
    results.return = Buffer.alloc(0);
    results.exception = 0;
    results.gasUsed = new BN(opts.gasLimit);
    results.exceptionError = error.OUT_OF_GAS;
  } else {
    results.return = returnData;
    results.exception = 1;
  }

  return results;
};
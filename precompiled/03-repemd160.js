var ethUtil = require('ethereumjs-util');
var crypto = require('crypto');
var BN = require('bn.js');
const error = require('./constants.js').ERROR;

const fees = require('ethereum-common').fees;

var results = {};
var ripemd160 = crypto.createHash('RSA-RIPEMD160');
var data = opts.data;
var gasCost = fees.ripemd160Gas.v;

if (opts.gasLimit.cmp(new BN(gasCost)) === -1) {
  results.gasUsed = opts.gasLimit;
  results.exception = 0; // 0 means VM fail (in this case because of OOG)
  results.exceptionErr = error.OUT_OF_GAS;
  return results;
}

results.gasUsed = gasCost;

var dataGas2 = Math.ceil(opts.data.length / 32) * fees.ripemd160WordGas.v;
// console.log('data: ' + data.toString('hex'));

if (opts.gasLimit.cmp(new BN(gasCost + dataGas2)) === -1) {
  results.gasUsed = opts.gasLimit;
  results.exceptionErr = error.OUT_OF_GAS;
  results.exception = 0; // 0 means VM fail (in this case because of OOG)
  return results;
}

results.gasUsed += dataGas2;
results.gasUsed = new BN(results.gasUsed);

hashStr = ethUtil.pad(ripemd160.update(data).digest('bin'), 32); // nb: bin

results.exception = 1;
results.returnValue = new Buffer(hashStr, 'hex');

return results;

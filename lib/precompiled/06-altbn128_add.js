const utils = require('ethereumjs-util')
const BN = utils.BN

module.exports = function (opts) {
  var results = {}
  var data = opts.data

  // Temporary, replace with finalized gas cost from EIP spec (via ethereum-common)
  results.gasUsed = new BN(5000)

  results.return = data
  results.exception = 1

  return results
}

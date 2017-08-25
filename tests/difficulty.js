const testing = require('ethereumjs-testing')
const utils = require('ethereumjs-util')
const tape = require('tape')
const Block = require('../')
const BN = utils.BN

function normalize (data) {
  Object.keys(data).map(function (i) {
    if (i !== 'homestead' && typeof (data[i]) === 'string') {
      data[i] = utils.isHexPrefixed(data[i]) ? new BN(utils.toBuffer(data[i])) : new BN(data[i])
    }
  })
}

tape('[Header]: difficulty tests', t => {
  let args = {}
  args.file = /^difficultyHomestead/
  testing.getTestsFromArgs('BasicTests', (fileName, testName, test) => {
    return new Promise((resolve, reject) => {
      normalize(test)

      var parentBlock = new Block()
      parentBlock.header.timestamp = test.parentTimestamp
      parentBlock.header.difficulty = test.parentDifficulty

      var block = new Block()
      block.header.isHomestead = function () {
        return true
      }

      block.header.timestamp = test.currentTimestamp
      block.header.difficulty = test.currentDifficulty
      block.header.number = test.currentBlockNumber

      var dif = block.header.canonicalDifficulty(parentBlock)
      t.equal(dif.toString(), test.currentDifficulty.toString(), 'test canonicalDifficulty')
      t.assert(block.header.validateDifficulty(parentBlock), 'test validateDifficulty')

      resolve()
    }).catch(err => console.log(err))
  }, args).then(() => {
    t.end()
  })
})

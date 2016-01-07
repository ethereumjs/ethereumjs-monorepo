const testing = require('ethereumjs-testing')
const ethUtil = require('ethereumjs-util')
const common = require('ethereum-common')
const basicTests = testing.tests.basicTests
const tape = require('tape')
const Block = require('../')
const BN = ethUtil.BN

// unfuck the tests
function deleteInvalidTests (data) {
  Object.keys(data).map(function (i) {
    if (i === 'difficultyHomestead') {
      Object.keys(data[i]).map(function (q) {
        if (new BN(data[i][q].currentBlockNumber.slice(2), 16).cmpn(common.homeSteadForkNumber.v) <= 0) {
          delete data[i][q]
        }
      })
    } else {
      Object.keys(data[i]).map(function (q) {
        if (new BN(data[i][q].currentBlockNumber).cmpn(common.homeSteadForkNumber.v) > 0) {
          delete data[i][q]
        }
      })
    }
  })
  return data
}

function normilize (data) {
  Object.keys(data).map(function (i) {
    data[i] = ethUtil.isHexPrefixed(data[i]) ? new BN(ethUtil.toBuffer(data[i])) : new BN(data[i])
  })
}

testing.runTests(function (data, st, cb) {
  normilize(data)
  var parentBlock = new Block()
  parentBlock.header.timestamp = data.parentTimestamp
  parentBlock.header.difficulty = data.parentDifficulty

  var block = new Block()
  block.header.timestamp = data.currentTimestamp
  block.header.difficulty = data.currentDifficulty
  block.header.number = data.currentBlockNumber

  var dif = block.header.canonicalDifficulty(parentBlock)
  st.equal(dif.toString(), data.currentDifficulty.toString())
  cb()
}, deleteInvalidTests({
  difficulty: basicTests.difficulty,
  difficultyHomestead: basicTests.difficultyHomestead
}), tape)

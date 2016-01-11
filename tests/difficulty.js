const testing = require('ethereumjs-testing')
const ethUtil = require('ethereumjs-util')
const basicTests = testing.tests.basicTests
const tape = require('tape')
const Block = require('../')
const BN = ethUtil.BN

function addHomesteadFlag (tests) {
  Object.keys(tests).map(function (q) {
    tests[q].homestead = true
  })
  return tests
}

function normilize (data) {
  Object.keys(data).map(function (i) {
    if (i !== 'homestead') {
      data[i] = ethUtil.isHexPrefixed(data[i]) ? new BN(ethUtil.toBuffer(data[i])) : new BN(data[i])
    }
  })
}

testing.runTests(function (data, st, cb) {
  normilize(data)
  var parentBlock = new Block()
  parentBlock.header.timestamp = data.parentTimestamp
  parentBlock.header.difficulty = data.parentDifficulty

  var block = new Block()
  if (data.homestead) {
    block.header.isHomestead = function () {
      return true
    }
  } else {
    block.header.isHomestead = function () {
      return false
    }
  }
  block.header.timestamp = data.currentTimestamp
  block.header.difficulty = data.currentDifficulty
  block.header.number = data.currentBlockNumber

  var dif = block.header.canonicalDifficulty(parentBlock)
  st.equal(dif.toString(), data.currentDifficulty.toString())
  cb()
}, {
  difficulty: basicTests.difficulty,
  difficultyHomestead: addHomesteadFlag(basicTests.difficultyHomestead)
}, tape)

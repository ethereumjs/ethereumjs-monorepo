const testing = require('ethereumjs-testing')
const difficulty = testing.tests.basicTests.difficulty
const tape = require('tape')
const Block = require('../')
const BN = require('ethereumjs-util').BN

testing.runTests(function (data, st, cb) {
  var parentBlock = new Block()
  parentBlock.header.timestamp = new BN(data.parentTimestamp)
  parentBlock.header.difficulty = new BN(data.parentDifficulty)

  var block = new Block()
  block.header.timestamp = new BN(data.currentTimestamp)
  block.header.difficulty = new BN(data.currentDifficulty)
  block.header.number = new BN(data.currentBlockNumber)

  var dif = block.header.canonicalDifficulty(parentBlock)
  st.equal(dif.toString(), data.currentDifficulty)
  cb()
}, {
  basicTests: difficulty
}, tape)

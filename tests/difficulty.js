const testing = require('ethereumjs-testing')
const difficulty = testing.tests.basicTests.difficulty
const tape = require('tape')
const Block = require('../')
const BN = require('bn.js')

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
  data: difficulty
}, tape)

// tape('[Common]: difficulty', function (t) {
//   var tests = Object.keys(difficulty)
//   tests.forEach(function (name) {
//     t.test('should generete the difficulty correctly - ' + name, function (st) {
//       var data = difficulty[name]
//       var parentBlock = new Block()
//       parentBlock.header.timestamp = new BN(data.parentTimestamp)
//       parentBlock.header.difficulty = new BN(data.parentDifficulty)

//       var block = new Block()
//       block.header.timestamp = new BN(data.currentTimestamp)
//       block.header.difficulty = new BN(data.currentDifficulty)
//       block.header.number = new BN(data.currentBlockNumber)

//       var dif = block.header.canonicalDifficulty(parentBlock)
//       st.equal(dif.toString(), data.currentDifficulty)
//       process.nextTick(st.end)
//     })
//   })
// })

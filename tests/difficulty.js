// const testing = require('ethereumjs-testing')
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
  t.test('should test error cases', function (st) {
    var parentBlock = new Block(null, { 'chain': 'mainnet', 'hardfork': 'spuriousDragon' })
    var block = new Block(null, { 'chain': 'mainnet', 'hardfork': 'spuriousDragon' })

    t.throws(function () { block.header.canonicalDifficulty(parentBlock) }, /Difficulty validation only supported on blocks >= byzantium$/, 'should throw on block with spuriousDragon HF initialization')
    st.end()
  })

  function runDifficultyTests (test, parentBlock, block, msg) {
    normalize(test)

    var dif = block.header.canonicalDifficulty(parentBlock)
    t.equal(dif.toString(), test.currentDifficulty.toString(), `test canonicalDifficulty (${msg})`)
    t.assert(block.header.validateDifficulty(parentBlock), `test validateDifficulty (${msg})`)
  }

  const testData = require('./testdata-difficulty.json')
  for (let testName in testData) {
    let test = testData[testName]
    let parentBlock = new Block(null, { 'chain': 'mainnet', 'hardfork': 'byzantium' })
    parentBlock.header.timestamp = test.parentTimestamp
    parentBlock.header.difficulty = test.parentDifficulty
    parentBlock.header.uncleHash = test.parentUncles

    let block = new Block(null, { 'chain': 'mainnet', 'hardfork': 'byzantium' })
    block.header.timestamp = test.currentTimestamp
    block.header.difficulty = test.currentDifficulty
    block.header.number = test.currentBlockNumber

    runDifficultyTests(test, parentBlock, block, 'fork determination by hardfork param')
  }

  for (let testName in testData) {
    let test = testData[testName]
    const BYZANTIUM_BLOCK = 4370000
    let parentBlock = new Block()
    parentBlock.header.timestamp = test.parentTimestamp
    parentBlock.header.difficulty = test.parentDifficulty
    parentBlock.header.uncleHash = test.parentUncles
    parentBlock.header.number = utils.intToBuffer(BYZANTIUM_BLOCK - 1)

    let block = new Block()
    block.header.timestamp = test.currentTimestamp
    block.header.difficulty = test.currentDifficulty
    block.header.number = test.currentBlockNumber

    if (utils.bufferToInt(block.header.number) >= BYZANTIUM_BLOCK) {
      runDifficultyTests(test, parentBlock, block, 'fork determination by block number')
    } else {
      t.throws(function () { block.header.canonicalDifficulty(parentBlock) }, /Difficulty validation only supported on blocks >= byzantium$/, 'should throw on block < byzantium')
    }
  }
  t.end()

  // Temporarily run local test selection
  // also: implicit testing through ethereumjs-vm tests
  // (no Byzantium difficulty tests available yet)
  /*
  let args = {}
  args.file = /^difficultyHomestead/
  testing.getTestsFromArgs('BasicTests', (fileName, testName, test) => {
    return new Promise((resolve, reject) => {
      runDifficultyTests(test)
      resolve()
    }).catch(err => console.log(err))
  }, args).then(() => {
    t.end()
  })
  */
})

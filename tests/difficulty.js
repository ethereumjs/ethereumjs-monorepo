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
  function runDifficultyTests (test, parentBlock, block, msg) {
    normalize(test)

    var dif = block.header.canonicalDifficulty(parentBlock)
    t.equal(dif.toString(), test.currentDifficulty.toString(), `test canonicalDifficulty (${msg})`)
    t.assert(block.header.validateDifficulty(parentBlock), `test validateDifficulty (${msg})`)
  }

  const hardforkTestData = {
    'chainstart': require('./difficultyFrontier.json').tests,
    'homestead': require('./difficultyHomestead.json').tests,
    'byzantium': require('./difficultyByzantium.json').tests,
    'constantinople': require('./difficultyConstantinople.json').tests
  }
  for (let hardfork in hardforkTestData) {
    const testData = hardforkTestData[hardfork]
    for (let testName in testData) {
      let test = testData[testName]
      let parentBlock = new Block(null, { 'chain': 'mainnet', 'hardfork': hardfork })
      parentBlock.header.timestamp = test.parentTimestamp
      parentBlock.header.difficulty = test.parentDifficulty
      parentBlock.header.uncleHash = test.parentUncles

      let block = new Block(null, { 'chain': 'mainnet', 'hardfork': hardfork })
      block.header.timestamp = test.currentTimestamp
      block.header.difficulty = test.currentDifficulty
      block.header.number = test.currentBlockNumber

      runDifficultyTests(test, parentBlock, block, 'fork determination by hardfork param')
    }
  }

  const chainTestData = {
    'mainnet': require('./difficultyMainNetwork.json').tests,
    'ropsten': require('./difficultyRopstenByzantium.json').tests
  }
  for (let chain in chainTestData) {
    const testData = chainTestData[chain]
    for (let testName in testData) {
      let test = testData[testName]
      let parentBlock = new Block(null, { 'chain': chain })
      parentBlock.header.timestamp = test.parentTimestamp
      parentBlock.header.difficulty = test.parentDifficulty
      parentBlock.header.uncleHash = test.parentUncles

      let block = new Block(null, { 'chain': chain })
      block.header.timestamp = test.currentTimestamp
      block.header.difficulty = test.currentDifficulty
      block.header.number = test.currentBlockNumber

      runDifficultyTests(test, parentBlock, block, 'fork determination by block number')
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

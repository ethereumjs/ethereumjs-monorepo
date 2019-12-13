import * as utils from 'ethereumjs-util'
import { BN } from 'ethereumjs-util'
import { Block } from '../src/block'
import tape = require('tape')

function isHexPrefixed(str: string) {
  return str.toLowerCase().startsWith('0x')
}

function normalize(data: any) {
  Object.keys(data).forEach(function(i) {
    if (i !== 'homestead' && typeof data[i] === 'string') {
      data[i] = isHexPrefixed(data[i]) ? new BN(utils.toBuffer(data[i])) : new BN(data[i])
    }
  })
}

tape('[Header]: difficulty tests', t => {
  function runDifficultyTests(test: any, parentBlock: Block, block: Block, msg: string) {
    normalize(test)

    const dif = block.header.canonicalDifficulty(parentBlock)
    t.equal(dif.toString(), test.currentDifficulty.toString(), `test canonicalDifficulty (${msg})`)
    t.assert(block.header.validateDifficulty(parentBlock), `test validateDifficulty (${msg})`)
  }

  const hardforkTestData: any = {
    chainstart: require('./difficultyFrontier.json').tests,
    homestead: require('./difficultyHomestead.json').tests,
    byzantium: require('./difficultyByzantium.json').tests,
    constantinople: require('./difficultyConstantinople.json').tests,
    muirGlacier: Object.assign(
      require('./difficultyEIP2384.json').tests,
      require('./difficultyEIP2384_random.json').tests,
      require('./difficultyEIP2384_random_to20M.json').tests,
    ),
  }
  for (const hardfork in hardforkTestData) {
    const testData = hardforkTestData[hardfork]
    for (const testName in testData) {
      const test = testData[testName]
      const parentBlock = new Block(undefined, { chain: 'mainnet', hardfork: hardfork })
      parentBlock.header.timestamp = test.parentTimestamp
      parentBlock.header.difficulty = test.parentDifficulty
      parentBlock.header.uncleHash = test.parentUncles

      const block = new Block(undefined, { chain: 'mainnet', hardfork: hardfork })
      block.header.timestamp = test.currentTimestamp
      block.header.difficulty = test.currentDifficulty
      block.header.number = test.currentBlockNumber

      runDifficultyTests(
        test,
        parentBlock,
        block,
        `fork determination by hardfork param (${hardfork})`,
      )
    }
  }

  const chainTestData: any = {
    mainnet: require('./difficultyMainNetwork.json').tests,
    ropsten: require('./difficultyRopstenConstantinople.json').tests,
  }
  for (const chain in chainTestData) {
    const testData = chainTestData[chain]
    for (const testName in testData) {
      const test = testData[testName]
      const parentBlock = new Block(undefined, { chain: chain })
      parentBlock.header.timestamp = test.parentTimestamp
      parentBlock.header.difficulty = test.parentDifficulty
      parentBlock.header.uncleHash = test.parentUncles

      const block = new Block(undefined, { chain: chain })
      block.header.timestamp = test.currentTimestamp
      block.header.difficulty = test.currentDifficulty
      block.header.number = test.currentBlockNumber

      runDifficultyTests(
        test,
        parentBlock,
        block,
        `fork determination by block number (${test.currentBlockNumber})`,
      )
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

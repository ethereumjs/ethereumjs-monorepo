import { toBuffer, bufferToInt, intToBuffer } from 'ethereumjs-util'
import { Block } from '../src/block'
import tape = require('tape')
import Common from '@ethereumjs/common'

const { BN } = require('ethereumjs-util')

function isHexPrefixed(str: string) {
  return str.toLowerCase().startsWith('0x')
}

function normalize(data: any) {
  Object.keys(data).forEach(function (i) {
    if (i !== 'homestead' && typeof data[i] === 'string') {
      data[i] = isHexPrefixed(data[i]) ? new BN(toBuffer(data[i])) : new BN(data[i])
    }
  })
}

tape('[Header]: difficulty tests', (t) => {
  function runDifficultyTests(test: any, parentBlock: Block, block: Block, msg: string) {
    normalize(test)

    const dif = block.header.canonicalDifficulty(parentBlock)
    t.equal(dif.toString(), test.currentDifficulty.toString(), `test canonicalDifficulty (${msg})`)
    t.assert(block.header.validateDifficulty(parentBlock), `test validateDifficulty (${msg})`)
  }

  const hardforkTestData: any = {
    chainstart: require('./testdata/difficultyFrontier.json').tests,
    homestead: require('./testdata/difficultyHomestead.json').tests,
    byzantium: require('./testdata/difficultyByzantium.json').tests,
    constantinople: require('./testdata/difficultyConstantinople.json').tests,
    muirGlacier: Object.assign(
      require('./testdata/difficultyEIP2384.json').tests,
      require('./testdata/difficultyEIP2384_random.json').tests,
      require('./testdata/difficultyEIP2384_random_to20M.json').tests,
    ),
  }
  for (const hardfork in hardforkTestData) {
    const testData = hardforkTestData[hardfork]
    for (const testName in testData) {
      const test = testData[testName]
      const common = new Common({ chain: 'mainnet', hardfork: hardfork })
      const parentBlock = new Block(undefined, { common })
      parentBlock.header.timestamp = test.parentTimestamp
      parentBlock.header.difficulty = test.parentDifficulty
      parentBlock.header.uncleHash = test.parentUncles

      const block = new Block(undefined, { common })
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
    mainnet: require('./testdata/difficultyMainNetwork.json').tests,
    ropsten: require('./testdata/difficultyRopstenConstantinople.json').tests,
  }
  for (const chain in chainTestData) {
    const testData = chainTestData[chain]
    for (const testName in testData) {
      const test = testData[testName]
      const common = new Common({ chain })
      const parentData = {
        header: {
          timestamp: test.parentTimestamp,
          difficulty: test.parentDifficulty,
          number: intToBuffer(bufferToInt(test.currentBlockNumber) - 1),
          uncleHash: test.parentUncles,
        },
      }
      const parentBlock = new Block(parentData, { common, hardforkByBlockNumber: true })

      const blockData = {
        header: {
          timestamp: test.currentTimestamp,
          difficulty: test.currentDifficulty,
          number: test.currentBlockNumber,
        },
      }
      const block = new Block(blockData, { common, hardforkByBlockNumber: true })

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

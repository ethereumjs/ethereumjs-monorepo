import { Chain, Common } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { Block } from '../src'

function runDifficultyTests(test: any, parentBlock: Block, block: Block, msg: string) {
  const dif = block.ethashCanonicalDifficulty(parentBlock)
  assert.equal(dif, BigInt(test.currentDifficulty), `test ethashCanonicalDifficulty: ${msg}`)
}

type TestData = { [key: string]: any }

const hardforkTestData: TestData = {
  chainstart: require('../../ethereum-tests/DifficultyTests/dfFrontier/difficultyFrontier.json')
    .difficultyFrontier.Frontier,
  homestead: require('../../ethereum-tests/DifficultyTests/dfHomestead/difficultyHomestead.json')
    .difficultyHomestead.Homestead,
  byzantium: require('../../ethereum-tests/DifficultyTests/dfByzantium/difficultyByzantium.json')
    .difficultyByzantium.Byzantium,
  constantinople:
    require('../../ethereum-tests/DifficultyTests/dfConstantinople/difficultyConstantinople.json')
      .difficultyConstantinople.Constantinople,
  muirGlacier: Object.assign(
    require('../../ethereum-tests/DifficultyTests/dfEIP2384/difficultyEIP2384.json')
      .difficultyEIP2384.Berlin,
    require('../../ethereum-tests/DifficultyTests/dfEIP2384/difficultyEIP2384_random.json')
      .difficultyEIP2384_random.Berlin,
    require('../../ethereum-tests/DifficultyTests/dfEIP2384/difficultyEIP2384_random_to20M.json')
      .difficultyEIP2384_random_to20M.Berlin
  ),
  arrowGlacier:
    require('../../ethereum-tests/DifficultyTests/dfArrowGlacier/difficultyArrowGlacier.json')
      .difficultyArrowGlacier.ArrowGlacier,
  grayGlacier:
    require('../../ethereum-tests/DifficultyTests/dfGrayGlacier/difficultyGrayGlacier.json')
      .difficultyGrayGlacier.GrayGlacier,
}

const chainTestData: TestData = {
  mainnet: require('../../ethereum-tests/BasicTests/difficultyMainNetwork.json'),
  ropsten: require('../../ethereum-tests/BasicTests/difficultyRopsten.json'),
}

describe('[Header]: difficulty tests', () => {
  it('by hardfork', () => {
    /* eslint-disable no-restricted-syntax */
    for (const hardfork in hardforkTestData) {
      const testData = hardforkTestData[hardfork]
      for (const testName in testData) {
        const test = testData[testName]
        const common = new Common({ chain: Chain.Mainnet, hardfork })
        // Unschedule any timestamp since tests are not configured for timestamps
        common
          .hardforks()
          .filter((hf) => hf.timestamp !== undefined)
          .map((hf) => {
            hf.timestamp = undefined
          })
        const blockOpts = { common }
        const uncleHash = test.parentUncles === '0x00' ? undefined : test.parentUncles
        const parentBlock = Block.fromBlockData(
          {
            header: {
              timestamp: test.parentTimestamp,
              difficulty: test.parentDifficulty,
              uncleHash,
            },
          },
          blockOpts
        )

        const block = Block.fromBlockData(
          {
            header: {
              timestamp: test.currentTimestamp,
              difficulty: test.currentDifficulty,
              number: test.currentBlockNumber,
            },
          },
          blockOpts
        )

        runDifficultyTests(test, parentBlock, block, `fork determination by hardfork (${hardfork})`)
      }
    }
  })

  it('by chain', () => {
    for (const chain in chainTestData) {
      const testData = chainTestData[chain]
      for (const testName in testData) {
        const test = testData[testName]
        const common = new Common({ chain })
        const blockOpts = { common, hardforkByBlockNumber: true }
        const uncleHash = test.parentUncles === '0x00' ? undefined : test.parentUncles
        const parentBlock = Block.fromBlockData(
          {
            header: {
              timestamp: test.parentTimestamp,
              difficulty: test.parentDifficulty,
              number: BigInt(test.currentBlockNumber) - BigInt(1),
              uncleHash,
            },
          },
          blockOpts
        )

        const block = Block.fromBlockData(
          {
            header: {
              timestamp: test.currentTimestamp,
              difficulty: test.currentDifficulty,
              number: test.currentBlockNumber,
            },
          },
          blockOpts
        )

        runDifficultyTests(
          test,
          parentBlock,
          block,
          `fork determination by block number (${test.currentBlockNumber})`
        )
      }
    }
  })
})

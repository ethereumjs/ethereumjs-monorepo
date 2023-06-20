import { Chain, Common } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import * as difficultyMainNetwork from '../../ethereum-tests/BasicTests/difficultyMainNetwork.json'
import * as difficultyRopsten from '../../ethereum-tests/BasicTests/difficultyRopsten.json'
import * as difficultyArrowGlacier from '../../ethereum-tests/DifficultyTests/dfArrowGlacier/difficultyArrowGlacier.json'
import * as difficultyByzantium from '../../ethereum-tests/DifficultyTests/dfByzantium/difficultyByzantium.json'
import * as difficultyConstantinople from '../../ethereum-tests/DifficultyTests/dfConstantinople/difficultyConstantinople.json'
import * as difficultyEIP2384 from '../../ethereum-tests/DifficultyTests/dfEIP2384/difficultyEIP2384.json'
import * as difficultyEIP2384_random from '../../ethereum-tests/DifficultyTests/dfEIP2384/difficultyEIP2384_random.json'
import * as difficultyEIP2384_random_to20M from '../../ethereum-tests/DifficultyTests/dfEIP2384/difficultyEIP2384_random_to20M.json'
import * as difficultyFrontier from '../../ethereum-tests/DifficultyTests/dfFrontier/difficultyFrontier.json'
import * as difficultyGrayGlacier from '../../ethereum-tests/DifficultyTests/dfGrayGlacier/difficultyGrayGlacier.json'
import * as difficultyHomestead from '../../ethereum-tests/DifficultyTests/dfHomestead/difficultyHomestead.json'
import { Block } from '../src/index.js'

function runDifficultyTests(test: any, parentBlock: Block, block: Block, msg: string) {
  const dif = block.ethashCanonicalDifficulty(parentBlock)
  assert.equal(dif, BigInt(test.currentDifficulty), `test ethashCanonicalDifficulty: ${msg}`)
}

type TestData = { [key: string]: any }

const hardforkTestData: TestData = {
  chainstart: difficultyFrontier.difficultyFrontier.Frontier,
  homestead: difficultyHomestead.difficultyHomestead.Homestead,
  byzantium: difficultyByzantium.difficultyByzantium.Byzantium,
  constantinople: difficultyConstantinople.difficultyConstantinople.Constantinople,
  muirGlacier: Object.assign(
    difficultyEIP2384.difficultyEIP2384.Berlin,
    difficultyEIP2384_random.difficultyEIP2384_random.Berlin,
    difficultyEIP2384_random_to20M.difficultyEIP2384_random_to20M.Berlin
  ),
  arrowGlacier: difficultyArrowGlacier.difficultyArrowGlacier.ArrowGlacier,
  grayGlacier: difficultyGrayGlacier.difficultyGrayGlacier.GrayGlacier,
}

const chainTestData: TestData = {
  mainnet: difficultyMainNetwork,
  ropsten: difficultyRopsten,
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
      for (const testName in testData.default) {
        const test = testData[testName]
        const common = new Common({ chain })
        const blockOpts = { common, setHardfork: true }
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

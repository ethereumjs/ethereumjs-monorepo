import tape from 'tape'
import Common, { Chain } from '@ethereumjs/common'
import { bufferToInt } from 'ethereumjs-util'
import { Block } from '../src'

function runDifficultyTests(
  st: tape.Test,
  test: any,
  parentBlock: Block,
  block: Block,
  msg: string
) {
  const dif = block.canonicalDifficulty(parentBlock)
  st.equal(dif, BigInt(test.currentDifficulty), `test canonicalDifficulty: ${msg}`)
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
}

const chainTestData: TestData = {
  mainnet: require('../../ethereum-tests/BasicTests/difficultyMainNetwork.json'),
  ropsten: require('../../ethereum-tests/BasicTests/difficultyRopsten.json'),
}

tape('[Header]: difficulty tests', (t) => {
  t.test('by hardfork', (st) => {
    /* eslint-disable no-restricted-syntax */
    for (const hardfork in hardforkTestData) {
      const testData = hardforkTestData[hardfork]
      for (const testName in testData) {
        const test = testData[testName]
        const common = new Common({ chain: Chain.Mainnet, hardfork: hardfork })
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

        runDifficultyTests(
          st,
          test,
          parentBlock,
          block,
          `fork determination by hardfork (${hardfork})`
        )
      }
    }
    st.end()
  })

  t.test('by chain', (st) => {
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
              number: bufferToInt(test.currentBlockNumber) - 1,
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
          st,
          test,
          parentBlock,
          block,
          `fork determination by block number (${test.currentBlockNumber})`
        )
      }
    }
    st.end()
  })
})

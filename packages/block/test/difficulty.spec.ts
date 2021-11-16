import tape from 'tape'
import Common, { Chain } from '@ethereumjs/common'
import { BN, toBuffer, bufferToInt, isHexPrefixed } from 'ethereumjs-util'
import { Block } from '../src'

function normalize(data: any) {
  Object.keys(data).forEach((i) => {
    if (i !== 'homestead' && typeof data[i] === 'string') {
      data[i] = isHexPrefixed(data[i]) ? new BN(toBuffer(data[i])) : new BN(data[i])
    }
  })
}

function runDifficultyTests(
  st: tape.Test,
  test: any,
  parentBlock: Block,
  block: Block,
  msg: string
) {
  normalize(test)
  const dif = block.canonicalDifficulty(parentBlock)
  st.ok(dif.eq(test.currentDifficulty), `test canonicalDifficulty: ${msg}`)
  st.ok(block.validateDifficulty(parentBlock), `test validateDifficulty: ${msg}`)
}

type TestData = { [key: string]: any }

const hardforkTestData: TestData = {
  chainstart: require('../../ethereum-tests/BasicTests/difficultyFrontier.json'),
  homestead: require('../../ethereum-tests/BasicTests/difficultyHomestead.json'),
  byzantium: require('../../ethereum-tests/BasicTests/difficultyByzantium.json'),
  constantinople: require('../../ethereum-tests/BasicTests/difficultyConstantinople.json'),
  muirGlacier: Object.assign(
    require('../../ethereum-tests/BasicTests/difficultyEIP2384.json'),
    require('../../ethereum-tests/BasicTests/difficultyEIP2384_random.json'),
    require('../../ethereum-tests/BasicTests/difficultyEIP2384_random_to20M.json')
  ),
  arrowGlacier: require('./testdata/difficultyArrowGlacier.json').difficultyArrowGlacier
    .ArrowGlacier,
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

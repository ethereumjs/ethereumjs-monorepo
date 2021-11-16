import tape from 'tape'
import { BN, toBuffer, bufferToInt } from 'ethereumjs-util'
import Common, { Chain } from '@ethereumjs/common'
import { Block } from '../src'

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

    const dif = block.canonicalDifficulty(parentBlock)
    t.equal(dif.toString(), test.currentDifficulty.toString(), `test canonicalDifficulty (${msg})`)
    t.assert(block.validateDifficulty(parentBlock), `test validateDifficulty (${msg})`)
  }

  const hardforkTestData: any = {
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

  /* eslint-disable-next-line no-restricted-syntax */
  for (const hardfork in hardforkTestData) {
    const testData = hardforkTestData[hardfork]
    /* eslint-disable-next-line no-restricted-syntax */
    for (const testName in testData) {
      const test = testData[testName]
      const common = new Common({ chain: Chain.Mainnet, hardfork: hardfork })
      const parentBlock = Block.fromBlockData(
        {
          header: {
            timestamp: test.parentTimestamp,
            difficulty: test.parentDifficulty,
            // Ethereum-Tests changes parentUncles field from KECCAK256_RLP_ARRAY hash to 0x00 in v10.0 so
            // checks for that value and marks uncles undefined if so (equivalent to KECCAK256_RLP_ARRAY hash)
            uncleHash: test.parentUncles === '0x00' ? undefined : test.parentUncles,
          },
        },
        { common }
      )

      const block = Block.fromBlockData(
        {
          header: {
            timestamp: test.currentTimestamp,
            difficulty: test.currentDifficulty,
            number: test.currentBlockNumber,
          },
        },
        { common }
      )

      runDifficultyTests(
        test,
        parentBlock,
        block,
        `fork determination by hardfork param (${hardfork})`
      )
    }
  }

  const chainTestData: any = {
    mainnet: require('../../ethereum-tests/BasicTests/difficultyMainNetwork.json'),
    ropsten: require('../../ethereum-tests/BasicTests/difficultyRopsten.json'),
  }
  /* eslint-disable-next-line no-restricted-syntax */
  for (const chain in chainTestData) {
    const testData = chainTestData[chain]
    /* eslint-disable-next-line no-restricted-syntax */
    for (const testName in testData) {
      const test = testData[testName]
      const common = new Common({ chain })
      const parentData = {
        header: {
          timestamp: test.parentTimestamp,
          difficulty: test.parentDifficulty,
          number: bufferToInt(test.currentBlockNumber) - 1,
          uncleHash: test.parentUncles,
        },
      }
      const parentBlock = Block.fromBlockData(parentData, {
        common,
        hardforkByBlockNumber: true,
      })

      const blockData = {
        header: {
          timestamp: test.currentTimestamp,
          difficulty: test.currentDifficulty,
          number: test.currentBlockNumber,
        },
      }
      const block = Block.fromBlockData(blockData, {
        common,
        hardforkByBlockNumber: true,
      })

      runDifficultyTests(
        test,
        parentBlock,
        block,
        `fork determination by block number (${test.currentBlockNumber})`
      )
    }
  }

  t.end()

  // Temporarily run local test selection
  // also: implicit testing through @ethereumjs/vm tests
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

import { assert, describe, it } from 'vitest'

import { Mainnet } from '../src/chains.js'
import { Hardfork } from '../src/enums.js'
import { createCommonFromGethGenesis } from '../src/index.js'
import { parseGethGenesis } from '../src/utils.js'

import { invalidSpuriousDragonData } from './data/geth-genesis/invalid-spurious-dragon.js'
import { noExtraData } from './data/geth-genesis/no-extra-data.js'
import { poaData } from './data/geth-genesis/poa.js'
import { postMergeData } from './data/geth-genesis/post-merge.js'
import { testnetData } from './data/geth-genesis/testnetData.js'
import { postMergeHardforkData } from './data/post-merge-hardfork.js'

describe('[Utils/Parse]', () => {
  it('should parse geth params file', async () => {
    const params = parseGethGenesis(testnetData, 'rinkeby')
    assert.equal(params.genesis.nonce, '0x0000000000000042', 'nonce should be correctly formatted')
  })

  it('should throw with invalid Spurious Dragon blocks', async () => {
    const f = () => {
      parseGethGenesis(invalidSpuriousDragonData, 'bad_params')
    }
    assert.throws(f, undefined, undefined, 'should throw')
  })

  it('should import poa network params correctly', async () => {
    let params = parseGethGenesis(poaData, 'poa')
    assert.equal(params.genesis.nonce, '0x0000000000000000', 'nonce is formatted correctly')
    assert.deepEqual(
      params.consensus,
      { type: 'poa', algorithm: 'clique', clique: { period: 15, epoch: 30000 } },
      'consensus config matches',
    )
    const poaCopy = Object.assign({}, poaData)
    poaCopy.nonce = '00'
    params = parseGethGenesis(poaCopy, 'poa')
    assert.equal(
      params.genesis.nonce,
      '0x0000000000000000',
      'non-hex prefixed nonce is formatted correctly',
    )
    assert.equal(params.hardfork, Hardfork.London, 'should correctly infer current hardfork')
  })

  it('should generate expected hash with london block zero and base fee per gas defined', async () => {
    const params = parseGethGenesis(postMergeData, 'post-merge')
    assert.equal(params.genesis.baseFeePerGas, postMergeData.baseFeePerGas)
  })

  it('should successfully parse genesis file with no extraData', async () => {
    const params = parseGethGenesis(noExtraData, 'noExtraData')
    assert.equal(params.genesis.extraData, '0x', 'extraData set to 0x')
    assert.equal(params.genesis.timestamp, '0x10', 'timestamp parsed correctly')
  })

  it('should set merge to block 0 when terminalTotalDifficultyPassed is true', () => {
    const mergeAtGenesisData = {} as any
    Object.assign(mergeAtGenesisData, postMergeData)
    mergeAtGenesisData.config.terminalTotalDifficultyPassed = true
    const common = createCommonFromGethGenesis(mergeAtGenesisData, {})
    assert.equal(common.hardforks().slice(-1)[0].block, 0)
  })

  it('should successfully assign mainnet deposit contract address when none provided', async () => {
    const common = createCommonFromGethGenesis(postMergeHardforkData, {
      chain: 'customChain',
    })
    const depositContractAddress =
      common['_chainParams'].depositContractAddress ?? Mainnet.depositContractAddress

    assert.equal(
      depositContractAddress,
      Mainnet.depositContractAddress,
      'should assign mainnet deposit contract',
    )
  })

  it('should correctly parse deposit contract address', async () => {
    // clone json out to not have side effects
    const customData = JSON.parse(JSON.stringify(postMergeHardforkData))
    Object.assign(customData.config, {
      depositContractAddress: '0x4242424242424242424242424242424242424242',
    })

    const common = createCommonFromGethGenesis(customData, {
      chain: 'customChain',
    })
    const depositContractAddress =
      common['_chainParams'].depositContractAddress ?? Mainnet.depositContractAddress

    assert.equal(
      depositContractAddress,
      '0x4242424242424242424242424242424242424242',
      'should parse correct address',
    )
  })
  it('should add MergeNetSplitBlock if not present when Shanghai is present', () => {
    const genesisJSON = postMergeData
    // @ts-expect-error we want shanghaiTime to exist
    genesisJSON.config.shanghaiTime = Date.now()
    const common = createCommonFromGethGenesis(genesisJSON, {})
    assert.equal(
      common.hardforks().findIndex((hf) => hf.name === Hardfork.MergeNetsplitBlock),
      12,
    )
  })
  it('should not add Paris and MergeNetsplitBlock if Shanghai and ttdPassed are not present ', () => {
    const genesisJSON = postMergeData
    // @ts-expect-error we don't want shanghaiTime to exist
    delete genesisJSON.config.shanghaiTime
    // @ts-expect-error we don't want terminalTotalDifficultyPassed to exist
    delete genesisJSON.config.terminalTotalDifficultyPassed
    const common = createCommonFromGethGenesis(genesisJSON, {})
    assert.equal(
      common.hardforks().findIndex((hf) => hf.name === Hardfork.MergeNetsplitBlock),
      -1,
    )
    assert.equal(
      common.hardforks().findIndex((hf) => hf.name === Hardfork.Paris),
      -1,
    )
  })

  it('should assign correct blob schedule', () => {
    // clone json out to not have side effects
    const customData = JSON.parse(JSON.stringify(postMergeHardforkData))
    const customConfigData = {
      chainId: 3151908,
      homesteadBlock: 0,
      eip150Block: 0,
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      berlinBlock: 0,
      londonBlock: 0,
      mergeNetsplitBlock: 0,
      depositContractAddress: '0x4242424242424242424242424242424242424242',
      terminalTotalDifficulty: 0,
      terminalTotalDifficultyPassed: true,
      shanghaiTime: 0,
      cancunTime: 0,
      blobSchedule: {
        prague: {
          target: 61,
          max: 91,
          baseFeeUpdateFraction: 13338477,
        },
      },
      pragueTime: 1736942378,
    }
    Object.assign(customData.config, customConfigData)

    const common = createCommonFromGethGenesis(customData, {
      chain: 'customChain',
    })
    const paramsTx = {
      4844: {
        blobCommitmentVersionKzg: 1, // The number indicated a versioned hash is a KZG commitment
        blobGasPerBlob: 131072, // The base fee for blob gas per blob
        maxBlobGasPerBlock: 786432, // The max blob gas allowable per block
        blobGasPriceUpdateFraction: 3338477,
        targetBlobGasPerBlock: 393216,
      },
      7691: {
        maxBlobGasPerBlock: 1179648, // The max blob gas allowable per block
      },
    }
    common.updateParams(paramsTx)

    const blobGasPerBlob = common.param('blobGasPerBlob')

    const testCases = [
      // should be picked from eip params
      [Hardfork.Cancun, blobGasPerBlob * BigInt(3), blobGasPerBlob * BigInt(6), 3338477n],
      // from the genesis blobschedule
      [
        Hardfork.Prague,
        blobGasPerBlob * BigInt(customConfigData.blobSchedule.prague.target),
        blobGasPerBlob * BigInt(customConfigData.blobSchedule.prague.max),
        13338477,
      ],
    ]
    for (const [testHf, testTarget, testMax, testUpdateFraction] of testCases) {
      common.setHardfork(testHf as Hardfork)

      const targetBlobGasPerBlock = common.param('targetBlobGasPerBlock')
      const maxBlobGasPerBlock = common.param('maxBlobGasPerBlock')
      const blobGasPriceUpdateFraction = common.param('blobGasPriceUpdateFraction')

      assert.equal(targetBlobGasPerBlock, testTarget, 'target blob gas should match')
      assert.equal(maxBlobGasPerBlock, testMax, 'max blob gas should match')
      assert.equal(blobGasPriceUpdateFraction, testUpdateFraction, 'update fraction should match')
    }
  })

  it('should throw on invalid blob schedules', () => {
    const customData = JSON.parse(JSON.stringify(postMergeHardforkData))
    const customConfigData = {
      chainId: 3151908,
      homesteadBlock: 0,
      eip150Block: 0,
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      berlinBlock: 0,
      londonBlock: 0,
      mergeNetsplitBlock: 0,
      depositContractAddress: '0x4242424242424242424242424242424242424242',
      terminalTotalDifficulty: 0,
      terminalTotalDifficultyPassed: true,
      shanghaiTime: 0,
      cancunTime: 0,
      pragueTime: 1736942378,
      blobSchedule: undefined,
    }
    Object.assign(customData.config, customConfigData)
    const invalidBlobSchedules = [
      {
        prague: {
          max: 91,
          baseFeeUpdateFraction: 13338477,
        },
      },
      {
        prague: {
          target: 61,
          baseFeeUpdateFraction: 13338477,
        },
      },
      {
        prague: {
          target: 61,
          max: 91,
        },
      },
      {
        unknownHardfork: {
          target: 61,
          max: 91,
          baseFeeUpdateFraction: 13338477,
        },
      },
    ]

    for (const schedule of invalidBlobSchedules) {
      customData.config.blobSchedule = schedule
      assert.throws(() => createCommonFromGethGenesis(customData, {}))
    }
  })
})

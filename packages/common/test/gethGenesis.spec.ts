import {
  eip4844GethGenesis,
  goerliGethGenesis,
  invalidSpuriousDragonGethGenesis,
  kilnGethGenesis,
  postMergeGethGenesis,
} from '@ethereumjs/testdata'
import { assert, describe, it } from 'vitest'

import { parseGethGenesisState } from '../src/gethGenesis.ts'
import { Hardfork, Mainnet, createCommonFromGethGenesis, parseGethGenesis } from '../src/index.ts'

describe('[Common/genesis]', () => {
  it('should properly generate stateRoot from gethGenesis', () => {
    const genesisState = parseGethGenesisState(kilnGethGenesis)
    // just check for deposit contract inclusion
    assert.exists(genesisState['0x4242424242424242424242424242424242424242'][1])
    assert.strictEqual(
      genesisState['0x4242424242424242424242424242424242424242'][1].includes(
        // sample data check
        '0x60806040526004361061003',
      ),
      true,
      'should have deposit contract',
    )
  })
})

describe('[Utils/Parse]', () => {
  it('should parse geth params file', async () => {
    const params = parseGethGenesis(eip4844GethGenesis)
    assert.strictEqual(
      params.genesis.nonce,
      '0x0000000000000042',
      'nonce should be correctly formatted',
    )
  })

  it('should throw with invalid Spurious Dragon blocks', async () => {
    const f = () => {
      parseGethGenesis(invalidSpuriousDragonGethGenesis, 'bad_params')
    }
    assert.throws(f, undefined, undefined, 'should throw')
  })

  it('should import poa network params correctly', async () => {
    let params = parseGethGenesis(goerliGethGenesis, 'poa')
    assert.strictEqual(params.genesis.nonce, '0x0000000000000000', 'nonce is formatted correctly')
    assert.deepEqual(
      params.consensus,
      { type: 'poa', algorithm: 'clique', clique: { period: 15, epoch: 30000 } },
      'consensus config matches',
    )
    const poaCopy = Object.assign({}, goerliGethGenesis)
    poaCopy.nonce = '00'
    params = parseGethGenesis(poaCopy, 'poa')
    assert.strictEqual(
      params.genesis.nonce,
      '0x0000000000000000',
      'non-hex prefixed nonce is formatted correctly',
    )
    assert.strictEqual(
      params.hardfork,
      Hardfork.Istanbul,
      'should correctly infer current hardfork',
    )
  })

  it('should generate expected hash with london block zero and base fee per gas defined', async () => {
    const params = parseGethGenesis(postMergeGethGenesis, 'post-merge')
    assert.strictEqual(params.genesis.baseFeePerGas, postMergeGethGenesis.baseFeePerGas)
  })

  it('should successfully parse genesis file with no extraData', async () => {
    const params = parseGethGenesis({ ...postMergeGethGenesis, extraData: '' }, 'noExtraData')
    assert.strictEqual(params.genesis.extraData, '0x', 'extraData set to 0x')
    assert.strictEqual(params.genesis.nonce, '0x0000000000000042', 'nonce parsed correctly')
  })

  it('should set merge to block 0 when terminalTotalDifficultyPassed is true', () => {
    const mergeAtGenesisData = {} as any
    Object.assign(mergeAtGenesisData, postMergeGethGenesis)
    mergeAtGenesisData.config.terminalTotalDifficultyPassed = true
    const common = createCommonFromGethGenesis(mergeAtGenesisData, {})
    assert.strictEqual(common.hardforks().slice(-1)[0].block, 0)
  })

  it('should successfully assign mainnet deposit contract address when none provided', async () => {
    const common = createCommonFromGethGenesis(postMergeGethGenesis, {
      chain: 'customChain',
    })
    const depositContractAddress =
      common['_chainParams'].depositContractAddress ?? Mainnet.depositContractAddress

    assert.strictEqual(
      depositContractAddress,
      Mainnet.depositContractAddress,
      'should assign mainnet deposit contract',
    )
  })

  it('should correctly parse deposit contract address', async () => {
    // clone json out to not have side effects
    const customData = JSON.parse(JSON.stringify(postMergeGethGenesis))
    Object.assign(customData.config, {
      depositContractAddress: '0x4242424242424242424242424242424242424242',
    })

    const common = createCommonFromGethGenesis(customData, {
      chain: 'customChain',
    })
    const depositContractAddress =
      common['_chainParams'].depositContractAddress ?? Mainnet.depositContractAddress

    assert.strictEqual(
      depositContractAddress,
      '0x4242424242424242424242424242424242424242',
      'should parse correct address',
    )
  })
  it('should add MergeNetSplitBlock if not present when Shanghai is present', () => {
    const genesisJSON = postMergeGethGenesis
    genesisJSON.config.shanghaiTime = Date.now()
    const common = createCommonFromGethGenesis(genesisJSON, {})
    assert.strictEqual(
      common.hardforks().findIndex((hf) => hf.name === Hardfork.MergeNetsplitBlock),
      12,
    )
  })
  it('should not add Paris and MergeNetsplitBlock if Shanghai and ttdPassed are not present ', () => {
    const genesisJSON = postMergeGethGenesis
    delete genesisJSON.config.shanghaiTime
    delete genesisJSON.config.terminalTotalDifficultyPassed
    delete genesisJSON.config.mergeForkBlock
    const common = createCommonFromGethGenesis(genesisJSON, {})
    assert.strictEqual(
      common.hardforks().findIndex((hf) => hf.name === Hardfork.MergeNetsplitBlock),
      -1,
    )
    assert.strictEqual(
      common.hardforks().findIndex((hf) => hf.name === Hardfork.Paris),
      -1,
    )
  })

  it('should assign correct blob schedule', () => {
    // clone json out to not have side effects
    const customData = JSON.parse(JSON.stringify(postMergeGethGenesis))
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

      assert.strictEqual(targetBlobGasPerBlock, testTarget, 'target blob gas should match')
      assert.strictEqual(maxBlobGasPerBlock, testMax, 'max blob gas should match')
      assert.strictEqual(
        Number(blobGasPriceUpdateFraction),
        Number(testUpdateFraction),
        'update fraction should match',
      )
    }
  })

  it('should throw on invalid blob schedules', () => {
    const customData = JSON.parse(JSON.stringify(postMergeGethGenesis))
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

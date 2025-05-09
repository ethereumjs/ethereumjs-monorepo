import { customChainConfig } from '@ethereumjs/testdata'
import { assert, describe, it } from 'vitest'

import { Common, Hardfork, Mainnet, createCustomCommon } from '../src/index.ts'

import type { ChainConfig } from '../src/index.ts'

describe('[Common]: Custom chains', () => {
  it('chain -> object: should provide correct access to private network chain parameters', () => {
    const c = new Common({ chain: customChainConfig, hardfork: Hardfork.Byzantium })
    assert.strictEqual(c.chainName(), 'testnet', 'should initialize with chain name')
    assert.strictEqual(c.chainId(), BigInt(12345), 'should return correct chain Id')
    assert.strictEqual(c.hardforks()[3]['block'], 3, 'should return correct hardfork data')
    assert.strictEqual(c.bootstrapNodes()[1].ip, '10.0.0.2', 'should return a bootstrap node array')
  })

  it('custom() -> base functionality', () => {
    const mainnetCommon = new Common({ chain: Mainnet })

    const customChainParams = { name: 'custom', chainId: 123 }
    const customChainCommon = createCustomCommon(customChainParams, Mainnet, {
      hardfork: Hardfork.Byzantium,
    })

    // From custom chain params
    assert.strictEqual(customChainCommon.chainName(), customChainParams.name)
    assert.strictEqual(customChainCommon.chainId(), BigInt(customChainParams.chainId))

    // Fallback params from mainnet
    assert.deepEqual(customChainCommon.genesis(), mainnetCommon.genesis())
    assert.deepEqual(customChainCommon.bootstrapNodes(), mainnetCommon.bootstrapNodes())
    assert.deepEqual(customChainCommon.hardforks(), mainnetCommon.hardforks())

    // Set only to this Common
    assert.strictEqual(customChainCommon.hardfork(), 'byzantium')
  })

  it('custom() -> behavior', () => {
    let common = createCustomCommon({ chainId: 123 }, Mainnet)
    assert.strictEqual(
      common.consensusAlgorithm(),
      'casper',
      'should default to mainnet base chain',
    )
    assert.strictEqual(common.chainName(), 'mainnet', 'should set default custom chain name')

    common = createCustomCommon({ chainId: 123 }, Mainnet)
    assert.strictEqual(
      common.hardfork(),
      common.DEFAULT_HARDFORK,
      'uses default hardfork when no options are present',
    )

    common = createCustomCommon({ chainId: 123 }, Mainnet, {
      hardfork: Hardfork.Byzantium,
    })
    assert.strictEqual(
      common.hardfork(),
      Hardfork.Byzantium,
      'should correctly set an option (default options present)',
    )
  })

  it('customHardforks parameter: initialization and transition tests', () => {
    const c = createCustomCommon(
      {
        customHardforks: {
          // Hardfork to test EIP 2935
          testEIP2935Hardfork: {
            eips: [2935],
          },
        },
        hardforks: [
          {
            name: 'chainstart',
            block: 0,
          },
          {
            name: 'berlin',
            block: null,
            timestamp: 999,
          },
          {
            // Note: this custom hardfork name MUST be in customHardforks as field
            // If this is not the case, Common will throw with a random error
            // Should we throw early with a descriptive error? TODO
            name: 'testEIP2935Hardfork',
            block: null,
            timestamp: 1000,
          },
        ],
      },
      Mainnet,
    )
    // Note: default HF of Common is currently Prague
    // Did not pass any "hardfork" param
    assert.strictEqual(c.hardfork(), Hardfork.Prague)
    c.setHardforkBy({
      blockNumber: 0,
    })
    assert.strictEqual(c.hardfork(), Hardfork.Chainstart)
    c.setHardforkBy({
      blockNumber: 1,
      timestamp: 999,
    })
    assert.strictEqual(c.hardfork(), Hardfork.Berlin)
    assert.isFalse(c.isActivatedEIP(2935))
    c.setHardforkBy({
      blockNumber: 1,
      timestamp: 1000,
    })
    assert.strictEqual(c.hardfork(), 'testEIP2935Hardfork')
    assert.isTrue(c.isActivatedEIP(2935))
  })

  it('customChain: correctly set default hardfork on custom chain config', () => {
    const chainConfig: ChainConfig = {
      name: 'custom',
      chainId: 123,
      genesis: {
        gasLimit: 0,
        difficulty: 1,
        nonce: '0x42',
        extraData: '0x',
      },
      hardforks: [
        {
          name: 'chainstart',
          block: 0,
        },
      ],
      bootstrapNodes: [],
      consensus: {
        type: 'pos',
        algorithm: 'casper',
        casper: {},
      },
    }
    const c = createCustomCommon({ chainId: 123 }, chainConfig)
    assert.strictEqual(c.hardfork(), c.DEFAULT_HARDFORK)
    assert.strictEqual(c.hardfork(), Hardfork.Prague)
  })

  it('customHardforks: override params', () => {
    const c = createCustomCommon(
      {
        customHardforks: {
          // Hardfork which changes the gas of STOP from 0 to 10
          stop10Gas: {
            eips: [2935],
            params: {
              stop: 10,
            },
          },
        },
        hardforks: [
          {
            name: 'chainstart',
            block: 0,
          },
          {
            name: 'stop10Gas',
            block: null,
            timestamp: 1000,
          },
        ],
      },
      Mainnet,
    )
    c.setHardfork(Hardfork.Chainstart)
    assert.throws(() => {
      c.param('stop')
    })
    c.setHardforkBy({
      blockNumber: 1,
      timestamp: 1000,
    })
    assert.strictEqual(c.hardfork(), 'stop10Gas')
    assert.strictEqual(c.param('stop'), BigInt(10))
  })
})

describe('custom chain setup with hardforks with undefined/null block numbers', () => {
  it('Should work', () => {
    const nullHardforks = [
      {
        name: 'chainstart',
        block: 0,
      },
      { name: 'homestead', block: null },
      { name: 'tangerineWhistle', block: 10 },
    ]

    const common = createCustomCommon({ hardforks: nullHardforks }, Mainnet)
    common.setHardforkBy({ blockNumber: 10n })
    assert.strictEqual('tangerineWhistle', common.hardfork(), 'set correct hardfork')
    common.setHardforkBy({ blockNumber: 3n })
    assert.strictEqual('chainstart', common.hardfork(), 'set correct hardfork')
  })
})

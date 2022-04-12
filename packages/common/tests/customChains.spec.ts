import tape from 'tape'
import Common, { Chain, ConsensusType, CustomChain, Hardfork } from '../src/'
import testnet from './data/testnet.json'
import testnet2 from './data/testnet2.json'
import testnet3 from './data/testnet3.json'

import { AccountState, Chain as IChain, GenesisState } from '../src/types'

tape('[Common]: Custom chains', function (t: tape.Test) {
  t.test(
    'chain -> object: should provide correct access to private network chain parameters',
    function (st: tape.Test) {
      const c = new Common({ chain: testnet, hardfork: Hardfork.Byzantium })
      st.equal(c.chainName(), 'testnet', 'should initialize with chain name')
      st.equal(c.chainId(), BigInt(12345), 'should return correct chain Id')
      st.equal(c.networkId(), BigInt(12345), 'should return correct network Id')
      st.equal(
        c.genesis().hash,
        '0xaa00000000000000000000000000000000000000000000000000000000000000',
        'should return correct genesis hash'
      )
      st.equal(c.hardforks()[3]['block'], 3, 'should return correct hardfork data')
      st.equal(c.bootstrapNodes()[1].ip, '10.0.0.2', 'should return a bootstrap node array')

      st.end()
    }
  )

  t.test(
    'chain -> object: should handle custom chain parameters with missing field',
    function (st: tape.Test) {
      const chainParams = Object.assign({}, testnet)
      delete (chainParams as any)['hardforks']
      st.throws(
        function () {
          new Common({ chain: chainParams })
        },
        /Missing required/,
        'should throw an exception on missing parameter'
      ) // eslint-disable-line no-new

      st.end()
    }
  )

  t.test('custom() -> base functionality', function (st: tape.Test) {
    const mainnetCommon = new Common({ chain: Chain.Mainnet })

    const customChainParams = { name: 'custom', chainId: 123, networkId: 678 }
    const customChainCommon = Common.custom(customChainParams, { hardfork: Hardfork.Byzantium })

    // From custom chain params
    st.equal(customChainCommon.chainName(), customChainParams.name)
    st.equal(customChainCommon.chainId(), customChainParams.chainId))
  st.equal(customChainCommon.networkId(), customChainParams.networkId))

    // Fallback params from mainnet
    st.equal(customChainCommon.genesis(), mainnetCommon.genesis())
    st.equal(customChainCommon.bootstrapNodes(), mainnetCommon.bootstrapNodes())
    st.equal(customChainCommon.hardforks(), mainnetCommon.hardforks())

    // Set only to this Common
    st.equal(customChainCommon.hardfork(), 'byzantium')

    st.end()
  })

  t.test('custom() -> behavior', function (st: tape.Test) {
    let common = Common.custom({ chainId: 123 })
    st.deepEqual(common.networkId(), BigInt(1), 'should default to mainnet base chain')
    st.equal(common.chainName(), 'custom-chain', 'should set default custom chain name')

    common = Common.custom(CustomChain.PolygonMumbai)
    st.deepEqual(
      common.networkId(),
      BigInt(80001),
      'supported chain -> should initialize with correct chain ID'
    )
    for (const customChain of Object.values(CustomChain)) {
      common = Common.custom(customChain)
      st.equal(
        common.chainName(),
        customChain,
        `supported chain -> should initialize with enum name (${customChain})`
      )
    }

    try {
      //@ts-ignore TypeScript complains, nevertheless do the test for JS behavior
      Common.custom('this-chain-is-not-supported')
      st.fail('test should fail')
    } catch (e: any) {
      st.ok(
        e.message.includes('not supported'),
        'supported chain -> should throw if chain name is not supported'
      )
    }

    st.end()
  })

  t.test('customChains parameter: initialization exception', (st) => {
    try {
      new Common({ chain: testnet, customChains: [testnet] })
      st.fail('should throw')
    } catch (e: any) {
      st.ok(
        e.message.includes(
          'Chain must be a string, number, or bigint when initialized with customChains passed in'
        ),
        'should throw an exception on wrong initialization'
      )
    }

    st.end()
  })

  t.test('customChains parameter: initialization', (st) => {
    let c = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.Byzantium,
      customChains: [testnet],
    })
    st.equal(c.chainName(), 'mainnet', 'customChains, chain set to supported chain')
    st.equal(c.hardforkBlock()!, BigInt(4370000), 'customChains, chain set to supported chain')

    c.setChain('testnet')
    st.equal(c.chainName(), 'testnet', 'customChains, chain switched to custom chain')
    st.equal(c.hardforkBlock()!, BigInt(4), 'customChains, chain switched to custom chain')

    c = new Common({
      chain: 'testnet',
      hardfork: Hardfork.Byzantium,
      customChains: [testnet],
    })
    st.equal(c.chainName(), 'testnet', 'customChains, chain initialized with custom chain')
    st.equal(c.hardforkBlock()!, BigInt(4), 'customChains, chain initialized with custom chain')
    st.deepEqual(
      c.genesisState(),
      {},
      'customChains, should fall back to empty genesis state if none provided'
    )

    const customChains = [testnet, testnet2, testnet3]
    c = new Common({
      chain: 'testnet2',
      hardfork: Hardfork.Istanbul,
      customChains,
    })
    st.equal(c.chainName(), 'testnet2', 'customChains, chain initialized with custom chain')
    st.equal(c.hardforkBlock()!, BigInt(10), 'customChains, chain initialized with custom chain')

    c.setChain('testnet')
    st.equal(c.chainName(), 'testnet', 'customChains, should allow to switch custom chain')
    st.equal(
      c.consensusType(),
      ConsensusType.ProofOfWork,
      'customChains, should allow to switch custom chain'
    )

    const genesisState = {
      '0x0000000000000000000000000000000000000000': '0x1',
    }
    const customChainsWithGenesis: [IChain, GenesisState][] = [[testnet, genesisState]]
    c = new Common({
      chain: 'testnet',
      hardfork: Hardfork.Istanbul,
      customChains: customChainsWithGenesis,
    })
    st.deepEqual(
      c.genesisState(),
      genesisState,
      'customChains, should allow to initialize with genesis state'
    )

    st.equal(c.hardforks()[3].forkHash, '0x215201ca', 'forkhash should be calculated correctly')

    const contractAccount = '0x96fb4792cf2B3A7EF9842D1Af74f8c99C6F4fF63'
    const eoaAccount = '0x0000000000000000000000000000000000000002'
    const storage: Array<[string, string]> = [
      ['0x000000000000000000000000000001', '0x3'],
      ['0x000000000000000000000000000002', '0x4'],
    ]

    const contractState: AccountState = ['0x10000', '0xbca', storage]
    const complexGenesisState = {
      [contractAccount]: contractState,
      [eoaAccount]: '0x100',
    }

    c = new Common({
      chain: 'testnet',
      customChains: [[testnet, complexGenesisState]],
    })

    // Retrieve balance from EoA
    st.deepEqual(c.genesisState()[eoaAccount], complexGenesisState[eoaAccount])

    // Retrieve code of the contract account
    st.deepEqual(c.genesisState()[contractAccount][1], complexGenesisState[contractAccount][1])

    // Retrieve value of first stored space in storage of account (state of contract)
    st.deepEqual(
      c.genesisState()[contractAccount][2][0][1],
      complexGenesisState[contractAccount][2][0][1]
    )

    // Retrieve value of second stored space in storage of account (state of contract)
    st.deepEqual(
      c.genesisState()[contractAccount][2][1][1],
      complexGenesisState[contractAccount][2][1][1]
    )

    st.end()
  })
})

import tape from 'tape'
import { KECCAK256_RLP } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'

import VM from '../../src'
import { isRunningInKarma } from '../util'
import { setupVM } from './utils'
import testnet from './testdata/testnet.json'
import testnet2 from './testdata/testnet2.json'
import testnetMerge from './testdata/testnetMerge.json'

// explicitly import util and buffer,
// needed for karma-typescript bundling
import * as util from 'util' // eslint-disable-line @typescript-eslint/no-unused-vars
import { Buffer } from 'buffer' // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Tests for the main constructor API and
 * exposed functionality by src/index.js
 *
 * The following re-exported VM methods are tested within
 * their own files:
 *
 * runBlockchain.spec.ts
 * runBlock.spec.ts
 * runTx.spec.ts
 * runCall.spec.ts
 * runCode.spec.ts
 *
 * opcodes.spec.ts (getActiveOpcodes())
 */

tape('VM -> basic instantiation / boolean switches', (t) => {
  t.test('should instantiate without params', async (st) => {
    const vm = await VM.create()
    st.ok(vm.stateManager)
    st.deepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root,
      KECCAK256_RLP,
      'it has default trie'
    )
    st.equal(vm._common.hardfork(), Hardfork.London, 'it has correct default HF')
    st.end()
  })

  t.test('should be able to activate precompiles', async (st) => {
    const vm = await VM.create({ activatePrecompiles: true })
    st.notDeepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root,
      KECCAK256_RLP,
      'it has different root'
    )
    st.end()
  })
})

tape('VM -> supportedHardforks', (t) => {
  t.test('should throw when common is set to an unsupported hardfork', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
    try {
      await VM.create({ common })
      st.fail('should have failed for unsupported hardfork')
    } catch (e: any) {
      st.ok(e.message.includes('supportedHardforks'))
    }
    st.end()
  })

  t.test('should succeed when common is set to a supported hardfork', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })
    const vm = await VM.create({ common })
    st.equal(vm._common.hardfork(), Hardfork.Byzantium)
    st.end()
  })
})

tape('VM -> common (chain, HFs, EIPs)', (t) => {
  t.test('should accept a common object as option', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

    const vm = await VM.create({ common })
    st.equal(vm._common, common)

    st.end()
  })

  t.test('should only accept valid chain and fork', async (st) => {
    let common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    let vm = await VM.create({ common })
    st.equal(
      (vm.stateManager as DefaultStateManager)._common.param('gasPrices', 'ecAdd'),
      BigInt(500)
    )

    try {
      common = new Common({ chain: 'mainchain', hardfork: Hardfork.Homestead })
      vm = await VM.create({ common })
      st.fail('should have failed for invalid chain')
    } catch (e: any) {
      st.ok(e.message.includes('not supported'))
    }

    st.end()
  })

  t.test('should accept a supported EIP', async (st) => {
    if (isRunningInKarma()) {
      st.skip('BLS does not work in karma')
      return st.end()
    }
    const common = new Common({ chain: Chain.Mainnet, eips: [2537] })
    try {
      await VM.create({ common })
      st.pass('did not throw')
    } catch (error) {
      st.fail('should not have thrown')
    }
    st.end()
  })

  t.test('should accept a custom chain config (Common.custom() static constructor)', async (st) => {
    const customChainParams = { name: 'custom', chainId: 123, networkId: 678 }
    const common = Common.custom(customChainParams, {
      baseChain: 'mainnet',
      hardfork: 'byzantium',
    })

    const vm = await VM.create({ common })
    st.equal(vm._common, common)
    st.end()
  })

  t.test(
    'should accept a custom chain config (Common customChains constructor option)',
    async (st) => {
      const customChains = [testnet, testnet2]
      const common = new Common({ chain: 'testnet', hardfork: Hardfork.Berlin, customChains })

      const vm = await VM.create({ common })
      st.equal(vm._common, common)
      st.end()
    }
  )
})

tape('VM -> hardforkByBlockNumber, hardforkByTD, state (deprecated), blockchain', (t) => {
  t.test('hardforkByBlockNumber, hardforkByTD', async (st) => {
    const customChains = [testnetMerge]
    const common = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

    let vm = await VM.create({ common, hardforkByBlockNumber: true })
    st.equal((vm as any)._hardforkByBlockNumber, true, 'should set hardforkByBlockNumber option')

    vm = await VM.create({ common, hardforkByTD: 5001 })
    st.equal((vm as any)._hardforkByTD, BigInt(5001), 'should set hardforkByTD option')

    try {
      await VM.create({ common, hardforkByBlockNumber: true, hardforkByTD: 3000 })
      st.fail('should not reach this')
    } catch (e: any) {
      const msg =
        'should throw if hardforkByBlockNumber and hardforkByTD options are used in conjunction'
      st.ok(
        e.message.includes(
          `The hardforkByBlockNumber and hardforkByTD options can't be used in conjunction`
        ),
        msg
      )
    }

    st.end()
  })

  t.test('should instantiate', async (st) => {
    const vm = await setupVM()
    st.deepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root,
      KECCAK256_RLP,
      'it has default trie'
    )
    st.end()
  })

  t.test('should pass the correct Common object when copying the VM', async (st) => {
    const vm = await setupVM({
      common: new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium }),
    })

    st.equal(vm._common.chainName(), 'ropsten')
    st.equal(vm._common.hardfork(), 'byzantium')

    const copiedVM = await vm.copy()
    st.equal(copiedVM._common.chainName(), 'ropsten')
    st.equal(copiedVM._common.hardfork(), 'byzantium')

    st.end()
  })
})

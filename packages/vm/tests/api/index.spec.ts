import tape from 'tape'
import { KECCAK256_RLP } from 'ethereumjs-util'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '../../src/state'
import VM from '../../src'
import { isRunningInKarma } from '../util'
import { setupVM } from './utils'
import testnet from './testdata/testnet.json'
import testnet2 from './testdata/testnet2.json'

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
  t.test('should instantiate without params', (st) => {
    const vm = new VM()
    st.ok(vm.stateManager)
    st.deepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root,
      KECCAK256_RLP,
      'it has default trie'
    )
    st.equal(vm._common.hardfork(), 'istanbul', 'it has correct default HF')
    st.end()
  })

  t.test('should be able to activate precompiles', async (st) => {
    const vm = new VM({ activatePrecompiles: true })
    await vm.init()
    st.notDeepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root,
      KECCAK256_RLP,
      'it has different root'
    )
    st.end()
  })

  t.test('should instantiate with async constructor', async (st) => {
    const vm = await VM.create({ activatePrecompiles: true })
    st.notDeepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root,
      KECCAK256_RLP,
      'it has different root'
    )
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
    let vm = new VM({ common })
    await vm.init()
    st.equal((vm.stateManager as DefaultStateManager)._common.param('gasPrices', 'ecAdd'), 500)

    try {
      common = new Common({ chain: 'mainchain', hardfork: Hardfork.Homestead })
      vm = new VM({ common })
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
    st.doesNotThrow(() => {
      new VM({ common })
    })
    st.end()
  })

  t.test(
    'should accept a custom chain config (Common.forCustomChain() static constructor)',
    async (st) => {
      const customChainParams = { name: 'custom', chainId: 123, networkId: 678 }
      const common = Common.forCustomChain('mainnet', customChainParams, 'byzantium')

      const vm = await VM.create({ common })
      st.equal(vm._common, common)
      st.end()
    }
  )

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
  t.test('should work with trie (state) provided', async (st) => {
    const trie = new Trie()
    const vm = new VM({ state: trie, activatePrecompiles: true })
    await vm.init()
    st.notDeepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root,
      KECCAK256_RLP,
      'it has different root'
    )
    st.end()
  })

  t.test('should instantiate', async (st) => {
    const vm = setupVM()
    await vm.init()
    st.deepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root,
      KECCAK256_RLP,
      'it has default trie'
    )
    st.end()
  })

  t.test('should pass the correct Common object when copying the VM', async (st) => {
    const vm = setupVM({
      common: new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium }),
    })
    await vm.init()

    st.equal(vm._common.chainName(), 'ropsten')
    st.equal(vm._common.hardfork(), 'byzantium')

    const copiedVM = vm.copy()
    st.equal(copiedVM._common.chainName(), 'ropsten')
    st.equal(copiedVM._common.hardfork(), 'byzantium')

    st.end()
  })
})

// explicitly import util and buffer,
// needed for karma-typescript bundling
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'
import { Account, Address, KECCAK256_RLP } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'
import * as util from 'util' // eslint-disable-line @typescript-eslint/no-unused-vars

import { VM } from '../../src/vm'
import { isRunningInKarma } from '../util'

import * as testnet from './testdata/testnet.json'
import * as testnet2 from './testdata/testnet2.json'
import * as testnetMerge from './testdata/testnetMerge.json'
import { setupVM } from './utils'

import type { VMOpts } from '../../src'
import type { DefaultStateManager } from '@ethereumjs/statemanager'

/**
 * Tests for the main constructor API and
 * exposed functionality by src/index.js
 *
 * The following re-exported VM methods are tested within
 * their own files:
 *
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
      (vm.stateManager as DefaultStateManager)._trie.root(),
      KECCAK256_RLP,
      'it has default trie'
    )
    st.equal(vm._common.hardfork(), Hardfork.Shanghai, 'it has correct default HF')
    st.end()
  })

  t.test('should be able to activate precompiles', async (st) => {
    const vm = await VM.create({ activatePrecompiles: true })
    st.notDeepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root(),
      KECCAK256_RLP,
      'it has different root'
    )
    st.end()
  })
})

tape('VM -> supportedHardforks', (t) => {
  t.test('should throw when common is set to an unsupported hardfork', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
    const prevSupported = EVM['supportedHardforks']
    EVM['supportedHardforks'] = [
      Hardfork.Chainstart,
      Hardfork.Homestead,
      Hardfork.Dao,
      Hardfork.TangerineWhistle,
      Hardfork.SpuriousDragon,
      Hardfork.Byzantium,
      Hardfork.Constantinople,
      Hardfork.Petersburg,
      Hardfork.Istanbul,
      Hardfork.MuirGlacier,
      Hardfork.Berlin,
      Hardfork.London,
      Hardfork.ArrowGlacier,
      Hardfork.GrayGlacier,
      Hardfork.MergeForkIdTransition,
      Hardfork.Paris,
    ]
    try {
      await VM.create({ common })
      st.fail('should have failed for unsupported hardfork')
    } catch (e: any) {
      st.ok(e.message.includes('supportedHardforks'))
    }
    // restore supported hardforks
    EVM['supportedHardforks'] = prevSupported
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
    st.equal(vm._common.param('gasPrices', 'ecAdd'), BigInt(500))

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

tape('VM -> hardforkByBlockNumber, hardforkByTTD, state (deprecated), blockchain', (t) => {
  t.test('hardforkByBlockNumber, hardforkByTTD', async (st) => {
    const customChains = [testnetMerge]
    const common = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

    let vm = await VM.create({ common, hardforkByBlockNumber: true })
    st.equal((vm as any)._hardforkByBlockNumber, true, 'should set hardforkByBlockNumber option')

    vm = await VM.create({ common, hardforkByTTD: 5001 })
    st.equal((vm as any)._hardforkByTTD, BigInt(5001), 'should set hardforkByTTD option')

    try {
      await VM.create({ common, hardforkByBlockNumber: true, hardforkByTTD: 3000 })
      st.fail('should not reach this')
    } catch (e: any) {
      const msg =
        'should throw if hardforkByBlockNumber and hardforkByTTD options are used in conjunction'
      st.ok(
        e.message.includes(
          `The hardforkByBlockNumber and hardforkByTTD options can't be used in conjunction`
        ),
        msg
      )
    }

    st.end()
  })

  t.test('should instantiate', async (st) => {
    const vm = await setupVM()
    st.deepEqual(
      (vm.stateManager as DefaultStateManager)._trie.root(),
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

  t.test('should pass the correct VM options when copying the VM', async (st) => {
    let opts: VMOpts = {
      hardforkByBlockNumber: true,
    }

    let vm = await VM.create(opts)
    let vmCopy = await vm.copy()
    st.deepEqual(
      (vmCopy as any)._hardforkByBlockNumber,
      true,
      'copy() correctly passes hardforkByBlockNumber option'
    )
    st.deepEqual(
      (vm as any)._hardforkByBlockNumber,
      (vmCopy as any)._hardforkByBlockNumber,
      'hardforkByBlockNumber options match'
    )

    //

    opts = {
      hardforkByTTD: BigInt(5001),
    }
    vm = await VM.create(opts)
    vmCopy = await vm.copy()
    st.deepEqual(
      (vmCopy as any)._hardforkByTTD,
      BigInt(5001),
      'copy() correctly passes hardforkByTTD option'
    )
    st.deepEqual(
      (vm as any)._hardforkByBlockNumber,
      (vmCopy as any)._hardforkByBlockNumber,
      'hardforkByTTD options match'
    )
  })
  tape('Ensure that precompile activation creates non-empty accounts', async (t) => {
    // setup the accounts for this test
    const caller = new Address(hexToBytes('00000000000000000000000000000000000000ee')) // caller address
    const contractAddress = new Address(hexToBytes('00000000000000000000000000000000000000ff')) // contract address
    // setup the vm
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const vmNotActivated = await VM.create({ common })
    const vmActivated = await VM.create({ common, activatePrecompiles: true })
    const code = '6000808080347300000000000000000000000000000000000000045AF100'
    /*
        idea: call the Identity precompile with nonzero value in order to trigger "callNewAccount" for the non-activated VM and do not deduct this
              when calling from the activated VM. Explicitly check that the difference in gas cost is equal to the common callNewAccount gas.
        code:             remarks: (top of the stack is at the zero index)
          PUSH1 0x00
          DUP1
          DUP1
          DUP1
          CALLVALUE
          PUSH20 0000000000000000000000000000000000000004
          GAS
          CALL            [gas, 0x00..04, 0, 0, 0, 0, 0]
          STOP
      */

    await vmNotActivated.stateManager.putContractCode(contractAddress, hexToBytes(code)) // setup the contract code
    await vmNotActivated.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x111))) // give calling account a positive balance
    await vmActivated.stateManager.putContractCode(contractAddress, hexToBytes(code)) // setup the contract code
    await vmActivated.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x111))) // give calling account a positive balance
    // setup the call arguments
    const runCallArgs = {
      caller, // call address
      gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
      to: contractAddress, // call to the contract address,
      value: BigInt(1),
    }

    const resultNotActivated = await vmNotActivated.evm.runCall(runCallArgs)
    const resultActivated = await vmActivated.evm.runCall(runCallArgs)

    const diff =
      resultNotActivated.execResult.executionGasUsed - resultActivated.execResult.executionGasUsed
    const expected = common.param('gasPrices', 'callNewAccount')

    t.equal(diff, expected, 'precompiles are activated')

    t.end()
  })
})

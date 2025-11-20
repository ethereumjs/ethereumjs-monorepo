import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import {
  SIGNER_A,
  SIGNER_G,
  customChainConfig,
  testnetMergeChainConfig,
} from '@ethereumjs/testdata'
import { createTx } from '@ethereumjs/tx'
import {
  bytesToHex,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
} from '@ethereumjs/util'
import { encodeFunctionData } from 'viem'
import { assert, describe, it } from 'vitest'

import { createVM, runTx } from '../../src/index.ts'

import type { AccountState, GenesisState } from '@ethereumjs/common'
import type { PrefixedHexString } from '@ethereumjs/util'

const storage: Array<[PrefixedHexString, PrefixedHexString]> = [
  [
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000000000000000000000000004',
  ],
]
const accountState: AccountState = [
  '0x0',
  '0x6080604052348015600f57600080fd5b506004361060285760003560e01c80632e64cec114602d575b600080fd5b60336047565b604051603e9190605d565b60405180910390f35b60008054905090565b6057816076565b82525050565b6000602082019050607060008301846050565b92915050565b600081905091905056fea2646970667358221220338001095242a334ada78025237955fa36b6f2f895ea7f297b69af72f8bc7fd164736f6c63430008070033',
  storage,
  '0x0',
]

/**
 * The bytecode of this contract state represents:
 * contract Storage {
 *     uint256 number = 4;
 *     function retrieve() public view returns (uint256){
 *         return number;
 *     }
 * }
 */

const contractAddress = '0x3651539F2E119a27c606cF0cB615410eCDaAE62a'
const genesisState: GenesisState = {
  [SIGNER_A.address.toString()]: '0x6d6172697573766477000000',
  [SIGNER_G.address.toString()]: '0x6d6172697573766477000000',
  [contractAddress]: accountState,
}

const common = createCustomCommon(customChainConfig, Mainnet, {
  hardfork: Hardfork.Chainstart,
})
const block = createBlock(
  {
    header: {
      gasLimit: 21_000,
    },
  },
  {
    common,
  },
)

describe('VM initialized with custom state', () => {
  it('should transfer eth from already existent account', async () => {
    const blockchain = await createBlockchain({ common, genesisState })
    const vm = await createVM({ blockchain, common })
    await vm.stateManager.generateCanonicalGenesis!(genesisState)

    const to = '0x00000000000000000000000000000000000000ff'
    const tx = createTx(
      {
        type: 0,
        to,
        value: '0x1',
        gasLimit: 21_000,
      },
      {
        common,
      },
    ).sign(SIGNER_A.privateKey)
    const result = await runTx(vm, {
      tx,
      block,
    })
    const toAddress = createAddressFromString(to)
    const receiverAddress = await vm.stateManager.getAccount(toAddress)

    assert.strictEqual(result.totalGasSpent.toString(), '21000')
    assert.strictEqual(receiverAddress!.balance.toString(), '1')
  })

  it('should retrieve value from storage', async () => {
    const blockchain = await createBlockchain({ common, genesisState })
    common.setHardfork(Hardfork.London)
    const vm = await createVM({ blockchain, common })
    await vm.stateManager.generateCanonicalGenesis!(genesisState)
    const calldata = encodeFunctionData({
      abi: [
        { type: 'function', name: 'retrieve', inputs: [], outputs: [], stateMutability: 'view' },
      ],
      functionName: 'retrieve',
    })

    const callResult = await vm.evm.runCall({
      to: createAddressFromString(contractAddress),
      data: hexToBytes(calldata as PrefixedHexString),
      caller: createAddressFromPrivateKey(SIGNER_A.privateKey),
    })

    const storage = genesisState[contractAddress][2]
    // Returned value should be 4, because we are trying to trigger the method `retrieve`
    // in the contract, which returns the variable stored in slot 0x00..00
    assert.strictEqual(bytesToHex(callResult.execResult.returnValue), storage?.[0][1])
  })

  it('setHardfork', async () => {
    const common = createCustomCommon(testnetMergeChainConfig, Mainnet, {
      hardfork: Hardfork.Istanbul,
    })

    let vm = await createVM({ common, setHardfork: true })
    assert.strictEqual(vm['_setHardfork'], true, 'should set setHardfork option')

    vm = await createVM({ common, setHardfork: 5001 })
    assert.strictEqual(vm['_setHardfork'], 5001, 'should set setHardfork option')
  })
})

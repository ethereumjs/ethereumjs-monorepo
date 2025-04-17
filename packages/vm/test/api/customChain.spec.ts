import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { customChainConfig, testnetMergeChainConfig } from '@ethereumjs/testdata'
import { createTx } from '@ethereumjs/tx'
import {
  bytesToHex,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
} from '@ethereumjs/util'
import { Interface } from 'ethers'
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
  '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b': '0x6d6172697573766477000000',
  '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c': '0x6d6172697573766477000000',
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
const privateKey = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')

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
    ).sign(privateKey)
    const result = await runTx(vm, {
      tx,
      block,
    })
    const toAddress = createAddressFromString(to)
    const receiverAddress = await vm.stateManager.getAccount(toAddress)

    assert.equal(result.totalGasSpent.toString(), '21000')
    assert.equal(receiverAddress!.balance.toString(), '1')
  })

  it('should retrieve value from storage', async () => {
    const blockchain = await createBlockchain({ common, genesisState })
    common.setHardfork(Hardfork.London)
    const vm = await createVM({ blockchain, common })
    await vm.stateManager.generateCanonicalGenesis!(genesisState)
    const calldata = new Interface(['function retrieve()']).getFunction('retrieve')!.selector

    const callResult = await vm.evm.runCall({
      to: createAddressFromString(contractAddress),
      data: hexToBytes(calldata),
      caller: createAddressFromPrivateKey(privateKey),
    })

    const storage = genesisState[contractAddress][2]
    // Returned value should be 4, because we are trying to trigger the method `retrieve`
    // in the contract, which returns the variable stored in slot 0x00..00
    assert.equal(bytesToHex(callResult.execResult.returnValue), storage?.[0][1])
  })

  it('setHardfork', async () => {
    const common = createCustomCommon(testnetMergeChainConfig, Mainnet, {
      hardfork: Hardfork.Istanbul,
    })

    let vm = await createVM({ common, setHardfork: true })
    assert.equal(vm['_setHardfork'], true, 'should set setHardfork option')

    vm = await createVM({ common, setHardfork: 5001 })
    assert.equal(vm['_setHardfork'], BigInt(5001), 'should set setHardfork option')
  })
})

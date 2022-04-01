import tape from 'tape'
import Common, { Hardfork } from '@ethereumjs/common'
import testChain from './testdata/testnet.json'
import VM from '../../src'
import { TransactionFactory } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'
import { AccountState } from '@ethereumjs/common/dist/types'
import { Interface } from '@ethersproject/abi'
import { Address } from 'ethereumjs-util'
import testnetMerge from './testdata/testnetMerge.json'

const storage: Array<[string, string]> = [
  [
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000000000000000000000000004',
  ],
]
const accountState: AccountState = [
  '0x0',
  '0x6080604052348015600f57600080fd5b506004361060285760003560e01c80632e64cec114602d575b600080fd5b60336047565b604051603e9190605d565b60405180910390f35b60008054905090565b6057816076565b82525050565b6000602082019050607060008301846050565b92915050565b600081905091905056fea2646970667358221220338001095242a334ada78025237955fa36b6f2f895ea7f297b69af72f8bc7fd164736f6c63430008070033',
  storage,
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
const genesisState = {
  '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b': '0x6d6172697573766477000000',
  '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c': '0x6d6172697573766477000000',
  [contractAddress]: accountState,
}

const common = new Common({
  chain: 'testnet',
  hardfork: 'london',
  customChains: [[testChain, genesisState]],
})
const block = Block.fromBlockData(
  {
    header: {
      gasLimit: 21_000,
      baseFeePerGas: 7,
    },
  },
  {
    common,
  }
)
const privateKey = Buffer.from(
  'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  'hex'
)

tape('VM initialized with custom state ', (t) => {
  t.test('should transfer eth from already existent account', async (t) => {
    const vm = await VM.create({ common, activateGenesisState: true })

    const to = '0x00000000000000000000000000000000000000ff'
    const unsignedTransferTx = TransactionFactory.fromTxData(
      {
        type: 2,
        to,
        value: '0x1',
        gasLimit: 21_000,
        maxFeePerGas: 7,
      },
      {
        common,
      }
    )
    const tx = unsignedTransferTx.sign(privateKey)
    const result = await vm.runTx({
      tx,
      block,
    })
    const toAddress = Address.fromString(to)
    const receiverAddress = await vm.stateManager.getAccount(toAddress)

    t.equal(result.gasUsed.toString(), '21000')
    t.equal(receiverAddress.balance.toString(), '1')
    t.end()
  })

  t.test('should retrieve value from storage', async (t) => {
    const vm = await VM.create({ common, activateGenesisState: true })
    const sigHash = new Interface(['function retrieve()']).getSighash('retrieve')

    const callResult = await vm.evm.runCall({
      to: Address.fromString(contractAddress),
      data: Buffer.from(sigHash.slice(2), 'hex'),
      caller: Address.fromPrivateKey(privateKey),
    })

    const [, , storage] = genesisState[contractAddress]
    // Returned value should be 4, because we are trying to trigger the method `retrieve`
    // in the contract, which returns the variable stored in slot 0x00..00
    t.equal(callResult.execResult.returnValue.toString('hex'), storage[0][1].slice(2))
    t.end()
  })

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
})

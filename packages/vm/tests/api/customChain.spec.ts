import tape from 'tape'
import Common from '@ethereumjs/common'
import testChain from './testdata/testnetWithGenesisState.json'
import VM from '../../src'
import { TransactionFactory } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'
import { AccountState } from '@ethereumjs/common/dist/types'
import { Interface } from '@ethersproject/abi'
import { Address } from 'ethereumjs-util'

const storage: Array<[string, string]> = [
  [
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    '0x0000000000000000000000000000000000000000000000000000000000000004',
  ],
]
const accountState: AccountState = [
  '0x0',
  '0x6080604052600460005534801561001557600080fd5b5060b6806100246000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80632e64cec114602d575b600080fd5b60336047565b604051603e9190605d565b60405180910390f35b60008054905090565b6057816076565b82525050565b6000602082019050607060008301846050565b92915050565b600081905091905056fea2646970667358221220338001095242a334ada78025237955fa36b6f2f895ea7f297b69af72f8bc7fd164736f6c63430008070033',
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

const contractAddress = '0x61FfE691821291D02E9Ba5D33098ADcee71a3a17'
const genesisState = {
  '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b': '0x6d6172697573766477000000',
  '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c': '0x6d6172697573766477000000',
  [contractAddress]: accountState,
}

const common = new Common({
  chain: 'testnet',
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

    const unsignedTransferTx = TransactionFactory.fromTxData(
      {
        type: 2,
        to: '0x00000000000000000000000000000000000000ff',
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

    t.equal(result.gasUsed.toString(), '21000')
  })
  t.test('should retrieve value from storage', async (t) => {
    const vm = await VM.create({ common, activateGenesisState: true })
    const sigHash = new Interface(['function retrieve()']).getSighash('retrieve')

    const callResult = await vm.runCall({
      to: Address.fromString(contractAddress),
      data: Buffer.from(sigHash.slice(2), 'hex'),
      caller: Address.fromPrivateKey(privateKey),
    })

    // Returned value should be 4, because we are trying to trigger the method `retrieve`
    // in the contract, which returns the variable stored in slot 0x00..01
    t.equal(
      callResult.execResult.returnValue.toString('hex'),
      genesisState[contractAddress][2][0][1].slice(2)
    )

    t.end()
  })
})

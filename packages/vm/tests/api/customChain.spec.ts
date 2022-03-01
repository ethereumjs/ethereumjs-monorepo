import tape from 'tape'
import Common from '@ethereumjs/common'
import testChain from './testdata/testnetWithGenesisState.json'
import VM from '../../src'
import { TransactionFactory } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'

const genesisState = {
  ['0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b']: '0x6d6172697573766477000000',
  ['0xbe862ad9abfe6f22bcb087716c7d89a26051f74c']: '0x6d6172697573766477000000',
}

tape.skip('VM initialized with custom ', (t) => {
  t.test('should transfer eth from already existant account', async (t) => {
    const common = new Common({ chain: 'testnet', customChains: [[testChain, genesisState]] })
    // const vm = await VM.create({ common })
    const vm = new VM({ common })
    const privateKey = Buffer.from(
      'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
      'hex'
    )

    const unsignedTx = TransactionFactory.fromTxData(
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
    const tx = unsignedTx.sign(privateKey)

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
    await vm.runTx({
      tx,
      block,
      skipBalance: true,
    })

    // console.log({ result })

    t.end()

    // const block = await vm.blockchain.getLatestBlock()
    // console.log({ block })
  })
})

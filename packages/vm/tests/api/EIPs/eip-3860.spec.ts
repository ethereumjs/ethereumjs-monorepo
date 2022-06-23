import * as tape from 'tape'
import { VM } from '../../../src/vm'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, privateToAddress } from '@ethereumjs/util'
const pkey = Buffer.from('20'.repeat(32), 'hex')
const GWEI = BigInt('1000000000')
const sender = new Address(privateToAddress(pkey))

tape('EIP 3860 tests', (t) => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3860],
  })

  t.test('EIP-3860 tests', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    const buffer = Buffer.allocUnsafe(1000000).fill(0x60)
    const tx = FeeMarketEIP1559Transaction.fromTxData({
      data:
        '0x7F6000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060005260206000F3' +
        buffer.toString('hex'),
      gasLimit: 100000000000,
      maxFeePerGas: 7,
      nonce: 0,
    }).sign(pkey)
    const result = await vm.runTx({ tx })
    st.ok(
      (result.execResult.exceptionError?.error as string) === 'initcode exceeds max initcode size',
      'initcode exceeds max size'
    )
  })
})

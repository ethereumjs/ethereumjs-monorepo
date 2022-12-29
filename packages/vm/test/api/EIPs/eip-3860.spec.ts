import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import * as tape from 'tape'

import { eip_util } from './eipUtils'

tape('EIP 3860 tests', (t) => {
  t.test('EIP-3860 tests', async (st) => {
    const vm = await eip_util.setUpVM([3860])

    const buffer = Buffer.allocUnsafe(1000000).fill(0x60)
    const tx = FeeMarketEIP1559Transaction.fromTxData({
      data:
        '0x7F6000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060005260206000F3' +
        buffer.toString('hex'),
      gasLimit: 100000000000,
      maxFeePerGas: 7,
      nonce: 0,
    }).sign(eip_util.pkey)
    const result = await vm.runTx({ tx })
    st.ok(
      (result.execResult.exceptionError?.error as string) === 'initcode exceeds max initcode size',
      'initcode exceeds max size'
    )
  })
})

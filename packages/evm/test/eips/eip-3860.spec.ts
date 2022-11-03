import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, privateToAddress } from '@ethereumjs/util'
import * as tape from 'tape'

import { EVM } from '../../src'
import { getEEI } from '../utils'

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
    const eei = await getEEI()
    const evm = await EVM.create({ common, eei })

    const buffer = Buffer.allocUnsafe(1000000).fill(0x60)

    // setup the call arguments
    const runCallArgs = {
      sender, // call address
      gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
      // Simple test, PUSH <big number> PUSH 0 RETURN
      // It tries to deploy a contract too large, where the code is all zeros
      // (since memory which is not allocated/resized to yet is always defaulted to 0)
      data: Buffer.concat([
        Buffer.from(
          '0x7F6000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060005260206000F3',
          'hex'
        ),
        buffer,
      ]),
    }
    const result = await evm.runCall(runCallArgs)
    st.ok(
      (result.execResult.exceptionError?.error as string) === 'initcode exceeds max initcode size',
      'initcode exceeds max size'
    )
  })
})

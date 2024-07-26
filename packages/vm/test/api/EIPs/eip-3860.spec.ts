import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { create1559FeeMarketTx } from '@ethereumjs/tx'
import { Account, Address, bytesToHex, hexToBytes, privateToAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VM, runTx } from '../../../src/index.js'
const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const GWEI = BigInt('1000000000')
const sender = new Address(privateToAddress(pkey))

describe('EIP 3860 tests', () => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3860],
  })

  it('EIP-3860 tests', async () => {
    const vm = await VM.create({ common })
    await vm.stateManager.putAccount(sender, new Account())
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account!.balance = balance
    await vm.stateManager.putAccount(sender, account!)

    const bytes = new Uint8Array(1000000).fill(0x60)
    // We create a tx with a common which has eip not yet activated else tx creation will
    // throw error
    const txCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const tx = create1559FeeMarketTx(
      {
        data: `0x7F6000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060005260206000F3${bytesToHex(
          bytes,
        ).slice(2)}`,
        gasLimit: 100000000000,
        maxFeePerGas: 7,
        nonce: 0,
      },
      { common: txCommon },
    ).sign(pkey)
    const result = await runTx(vm, { tx })
    assert.ok(
      (result.execResult.exceptionError?.error as string) === 'initcode exceeds max initcode size',
      'initcode exceeds max size',
    )
  })
})

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { createAddressFromString, hexToBytes, privateToAddress } from '@ethereumjs/util'
import { bench, describe } from 'vitest'

import { createVM, runTx } from '../src/index.ts'

import type { TypedTransaction } from '@ethereumjs/tx'
import type { VM } from '../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
const privateKey = hexToBytes('0x4646464646464646464646464646464646464646464646464646464646464646')
const sender = privateToAddress(privateKey)
const contractAddr = createAddressFromString('0x' + '02'.repeat(20))

/** Stores 1 at slot 0. */
const STORAGE_CONTRACT = hexToBytes('0x600160005500')

async function createVm(): Promise<VM> {
  return createVM({ common })
}

function buildTransferTxs(): TypedTransaction[] {
  const transfers = []
  for (let i = 0; i < 5; i++) {
    const to = createAddressFromString(`0x${(i + 3).toString(16).padStart(40, '0')}`)
    transfers.push(
      createLegacyTx(
        {
          nonce: i,
          gasPrice: BigInt(10),
          gasLimit: BigInt(21000),
          to,
          value: BigInt(1),
        },
        { common },
      ).sign(privateKey),
    )
  }
  return transfers
}

const transferTxs = buildTransferTxs()
const contractCallTx = createLegacyTx(
  {
    nonce: 0,
    gasPrice: BigInt(10),
    gasLimit: BigInt(100_000),
    to: contractAddr,
    value: BigInt(0),
    data: new Uint8Array(0),
  },
  { common },
).sign(privateKey)

describe('vm', () => {
  bench('vm block simple transfers', async () => {
    const runVm = await createVm()
    for (const tx of transferTxs) {
      await runTx(runVm, { tx, skipBalance: true, skipNonce: true })
    }
  })

  bench('vm block contract sstore', async () => {
    const runVm = await createVm()
    await runVm.stateManager.putCode(contractAddr, STORAGE_CONTRACT)
    await runTx(runVm, { tx: contractCallTx, skipBalance: true, skipNonce: true })
  })
})

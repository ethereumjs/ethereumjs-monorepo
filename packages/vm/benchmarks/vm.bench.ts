import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createFeeMarket1559Tx, createLegacyTx } from '@ethereumjs/tx'
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

const type2TransferTx = createFeeMarket1559Tx(
  {
    chainId: BigInt(1),
    nonce: 0,
    maxPriorityFeePerGas: BigInt(1),
    maxFeePerGas: BigInt(20),
    gasLimit: BigInt(21_000),
    to: createAddressFromString('0x0000000000000000000000000000000000000001'),
    value: BigInt(1),
    data: new Uint8Array(0),
    accessList: [],
  },
  { common },
).sign(privateKey)

const deployContractTx = createLegacyTx(
  {
    nonce: 0,
    gasPrice: BigInt(10),
    gasLimit: BigInt(500_000),
    value: BigInt(0),
    data: STORAGE_CONTRACT,
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

  bench('vm type2 transfer runTx', async () => {
    const runVm = await createVm()
    await runTx(runVm, { tx: type2TransferTx, skipBalance: true, skipNonce: true })
  })

  bench('vm contract deploy create', async () => {
    const runVm = await createVm()
    await runTx(runVm, { tx: deployContractTx, skipBalance: true, skipNonce: true })
  })
})

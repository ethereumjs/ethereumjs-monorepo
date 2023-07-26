import { Address, bufferToBigInt } from '@ethereumjs/util'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
import type { EEIInterface } from '../types'
import type { PrecompileInput } from './types'

const assert = require('assert')

async function incrementBalance(stateManager: EEIInterface, address: Address, delta: bigint) {
  const account = await stateManager.getAccount(address)
  account.balance = BigInt(account.balance) + delta
  await stateManager.putAccount(address, account)
}

export async function precompileFdTransfer(opts: PrecompileInput): Promise<ExecResult> {
  assert(opts.data)

  // TODO(asa): Pick an appropriate gas amount
  const gasUsed = BigInt(20)
  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  // data is the ABI encoding for [address,address,uint256]
  // 32 bytes each, but the addresses only use 20 bytes.
  const fromAddress = new Address(opts.data.slice(12, 32))
  const toAddress = new Address(opts.data.slice(44, 64))
  const value = bufferToBigInt(opts.data.slice(64, 96))

  await incrementBalance(opts._EVM.eei, fromAddress, value * BigInt(-1))
  await incrementBalance(opts._EVM.eei, toAddress, value)
  return {
    executionGasUsed: gasUsed,
    returnValue: Buffer.alloc(0),
  }
}

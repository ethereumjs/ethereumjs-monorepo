import { Account, Address, equalsBytes, toBytes } from '@ethereumjs/util'
import { Common } from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { RunBlockResult } from '../dist/cjs/types'
import { Mockchain } from './mockchain'

export interface BenchmarkType {
  [key: string]: Function
}

export interface BenchmarksType {
  [key: string]: BenchmarkType
}

interface StateTestPreAccount {
  balance: string
  code: string
  nonce: string
  storage: { [k: string]: string }
}

export async function getPreState(
  pre: {
    [k: string]: StateTestPreAccount
  },
  common: Common
): Promise<DefaultStateManager> {
  const state = new DefaultStateManager()
  await state.checkpoint()
  for (const k in pre) {
    const address = new Address(toBytes(k))
    const { nonce, balance, code, storage } = pre[k]
    const account = new Account(BigInt(nonce), BigInt(balance))
    await state.putAccount(address, account)
    await state.putContractCode(address, toBytes(code))
    for (const sk in storage) {
      const sv = storage[sk]
      const valueBytes = toBytes(sv)
      // verify if this value buffer is not a zero buffer. if so, we should not write it...
      const zeroBytesEquivalent = new Uint8Array(valueBytes.length)
      if (!equalsBytes(zeroBytesEquivalent, valueBytes)) {
        await state.putContractStorage(address, toBytes(sk), toBytes(sv))
      }
    }
  }
  await state.commit()
  return state
}

export function getBlockchain(blockhashes: any): Mockchain {
  let mockchain = new Mockchain()
  for (const blockNum in blockhashes) {
    const hash = blockhashes[blockNum]
    mockchain.putBlockHash(BigInt(blockNum), toBytes(hash))
  }
  return mockchain
}

export const verifyResult = (block: Block, result: RunBlockResult) => {
  // verify the receipts root, the logs bloom and the gas used after block execution,
  // throw if any of these is not the expected value
  if (result.receiptsRoot && !equalsBytes(result.receiptsRoot, block.header.receiptTrie)) {
    // there's something wrong here with the receipts trie.
    // if block has receipt data we can check against the expected result of the block
    // and the reported data of the VM in order to isolate the problem

    // check if there are receipts
    const { receipts } = result
    if (receipts) {
      let cumGasUsed = BigInt(0)
      for (let index = 0; index < receipts.length; index++) {
        let gasUsedExpected = receipts[index].cumulativeBlockGasUsed
        let cumGasUsedActual = receipts[index].cumulativeBlockGasUsed
        let gasUsed = cumGasUsedActual - cumGasUsed
        if (gasUsed !== gasUsedExpected) {
          console.log(`[DEBUG]
            Transaction at index ${index} of block ${block.header.number}
            did not yield expected gas.
            Gas used expected: ${gasUsedExpected},
            actual: ${gasUsed},
            difference: ${gasUsed - gasUsedExpected}`)
        }
        cumGasUsed = cumGasUsedActual
      }
    }
    throw new Error('invalid receiptTrie')
  }
  if (!equalsBytes(result.logsBloom, block.header.logsBloom)) {
    throw new Error('invalid logsBloom')
  }
  if (block.header.gasUsed !== result.gasUsed) {
    throw new Error('invalid gasUsed')
  }
}

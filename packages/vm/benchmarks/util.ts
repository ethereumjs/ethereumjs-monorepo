import BN = require('bn.js')
import { toBuffer, setLengthLeft } from 'ethereumjs-util'
import Account from '@ethereumjs/account'
import { encode } from 'rlp'
import { StateManager, DefaultStateManager } from '../dist/state'
import Common from '@ethereumjs/common'
import Mockchain from './mockchain'

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
  common: Common,
): Promise<StateManager> {
  const state = new DefaultStateManager({ common })
  await state.checkpoint()
  for (const k in pre) {
    const kBuf = toBuffer(k)
    const obj = pre[k]
    const code = toBuffer(obj.code)
    const acc = new Account()
    acc.nonce = hexToBuffer(obj.nonce)
    acc.balance = hexToBuffer(obj.balance)
    await state.putAccount(kBuf, acc)
    await state.putContractCode(kBuf, code)
    for (const sk in obj.storage) {
      const sv = obj.storage[sk]
      const valueBuffer = toBuffer(sv)
      // verify if this value buffer is not a zero buffer. if so, we should not write it...
      const zeroBufferEquivalent = Buffer.alloc(valueBuffer.length, 0)
      if (!zeroBufferEquivalent.equals(valueBuffer)) {
        await state.putContractStorage(kBuf, toBuffer(sk), toBuffer(sv))
      }
    }
  }
  await state.commit()
  return state
}

export function getBlockchain(blockhashes: any): Mockchain {
  let mockchain = new Mockchain()
  for (let hashStr in blockhashes) {
    const bn = new BN(hashStr.substr(2), 'hex')
    const hash = blockhashes[hashStr]
    const hashBuffer = Buffer.from(hash.substr(2), 'hex')
    mockchain.putBlockHash(bn, hashBuffer)
  }
  return mockchain
}

const hexToBuffer = (h: string, allowZero: boolean = false): Buffer => {
  const buf = toBuffer(h)
  if (!allowZero && buf.toString('hex') === '00') {
    return Buffer.alloc(0)
  }
  return buf
}

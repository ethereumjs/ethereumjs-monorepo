import BN = require('bn.js')
import { toBuffer, setLengthLeft } from 'ethereumjs-util'
import Account from '@ethereumjs/account'
import { encode } from 'rlp'
import { StateManager, DefaultStateManager } from '../dist/state'

interface StateTestPreAccount {
  balance: string
  code: string
  nonce: string
  storage: { [k: string]: string }
}

export async function getPreState(pre: {
  [k: string]: StateTestPreAccount
}): Promise<StateManager> {
  const state = new DefaultStateManager()
  await state.checkpoint()
  for (const k in pre) {
    const kBuf = toBuffer(k)
    const obj = pre[k]
    const code = toBuffer(obj.code)
    const acc = new Account()
    acc.nonce = hexToBuffer(obj.nonce)
    acc.balance = hexToBuffer(obj.balance)
    const storageTrie = state._trie.copy()
    storageTrie.root = null!
    for (const sk in obj.storage) {
      const sv = obj.storage[sk]
      const valBN = new BN(sv.slice(2), 16)
      if (valBN.isZero()) continue
      const val = encode(valBN.toBuffer('be'))
      const key = setLengthLeft(Buffer.from(sk.slice(2), 'hex'), 32)
      await storageTrie.put(key, val)
    }
    acc.stateRoot = storageTrie.root
    await state.putAccount(kBuf, acc)
    await state.putContractCode(kBuf, code)
  }
  await state.commit()
  return state
}

const hexToBuffer = (h: string, allowZero: boolean = false): Buffer => {
  const buf = toBuffer(h)
  if (!allowZero && buf.toString('hex') === '00') {
    return Buffer.alloc(0)
  }
  return buf
}

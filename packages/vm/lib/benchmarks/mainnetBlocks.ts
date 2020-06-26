import * as fs from 'fs'
import * as path from 'path'
import * as assert from 'assert'
import { merge } from 'lodash'
import Account from '@ethereumjs/account'
import { toBuffer, setLengthLeft } from 'ethereumjs-util'
import { encode } from 'rlp'
import blockFromRPC from '@ethereumjs/block/dist/from-rpc'
import VM from '../'
import { StateManager, DefaultStateManager } from '../state'
import BN = require('bn.js')

async function main() {
  const args = process.argv
  if (args.length < 3) {
    throw new Error('Insufficient arguments')
  }

  let data = JSON.parse(fs.readFileSync(args[2], 'utf8'))
  if (!Array.isArray(data)) data = [data]

  let preState = {}
  // Merge block prestates
  for (const blockPreState of data) {
    // Merge with block's pre state prioritizing pre state
    // of previous txes in block
    preState = merge(Object.assign({}, blockPreState.preState), preState)
  }

  let state = await getPreState(preState)
  let vm = new VM({ stateManager: state, hardfork: 'muirGlacier' })

  for (const blockData of data) {
    const block = blockFromRPC(blockData.block)

    // Mock blockchain for BLOCKHASH opcode
    const blockchain = {
      getBlock: (n: BN, cb: any) => {
        const bh = blockData.blockhashes['0x' + n.toString('hex')]
        if (!bh) {
          throw new Error('Unavailable blockhash requested')
        }
        return cb(null, { hash: () => toBuffer(bh) })
      }
    }
    vm.blockchain = blockchain as any

    console.log('running block', block.header.number)

    const start = process.hrtime()
    // TODO: use `runBlock` instead of running individual txes via `runTx`
    // TODO: validate tx, add receipt and gas usage checks
    for (const tx of block.transactions) {
      const txstart = process.hrtime()
      let res = await vm.runTx({ block, tx })
      const txElapsed = process.hrtime(start)[1] / 1000000
      //console.log(`Running tx ${tx.hash()} took ${process.hrtime(start)[0]} s, ${txElapsed.toFixed(3)} ms`)
    }
    const elapsed = process.hrtime(start)[1] / 1000000
    console.log(`Running block ${block.header.number} took ${process.hrtime(start)[0]} s, ${elapsed.toFixed(3)} ms`)
  }
}

export interface StateTestPreAccount {
  balance: string
  code: string
  nonce: string
  storage: {[k: string]: string}
}

export async function getPreState(pre: {[k: string]: StateTestPreAccount}): Promise<StateManager> {
  const state = new DefaultStateManager()
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
    await state.putAccount(
      kBuf,
      acc
    )
    await state.putContractCode(kBuf, code)
  }
  return state
}

const hexToBuffer = (h: string, allowZero: boolean = false): Buffer => {
  const buf = toBuffer(h)
  if (!allowZero && buf.toString('hex') === '00') {
    return Buffer.alloc(0)
  }
  return buf
}

main().then().catch((e: Error) => { throw e })

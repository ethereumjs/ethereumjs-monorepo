import * as fs from 'fs'
import { Account, toBuffer, setLengthLeft } from 'ethereumjs-util'
import { encode } from 'rlp'
import blockFromRPC from '@ethereumjs/block/dist/from-rpc'
import VM from '../../dist'
import { StateManager, DefaultStateManager } from '../../dist/state'
import BN = require('bn.js')
import Benchmark = require('benchmark')
import Common from '@ethereumjs/common'

const suite = new Benchmark.Suite()

async function main() {
  const args = process.argv
  if (args.length < 3 || args.length > 4) {
    console.log('Insufficient arguments')
    console.log('Usage: node BENCHMARK_SCRIPT BLOCK_FIXTURE [NUM_SAMPLES]')
    return process.exit(1)
  }

  let data = JSON.parse(fs.readFileSync(args[2], 'utf8'))
  if (!Array.isArray(data)) data = [data]
  console.log(`Total number of blocks in data set: ${data.length}`)

  let numSamples = data.length
  if (args.length === 4) {
    numSamples = Number(args[3])
  }
  console.log(`Number of blocks to sample: ${numSamples}`)
  data = data.slice(0, numSamples)

  for (const blockData of data) {
    const block = blockFromRPC(blockData.block)
    const blockNumber = block.header.number.toString()

    const stateManager = await getPreState(blockData.preState)
    const vm = new VM({
      stateManager,
      common: new Common({ chain: 'mainnet', hardfork: 'muirGlacier' }),
    })

    suite.add(`Block ${blockNumber}`, async () => {
      // TODO: validate tx, add receipt and gas usage checks
      await vm.copy().runBlock({
        block,
        generate: true,
        skipBlockValidation: true,
      })
    })
  }

  suite
    .on('cycle', function (event: any) {
      console.log(String(event.target))
    })
    .run()
}

export interface StateTestPreAccount {
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
    const { nonce, balance, code } = obj
    const acc = Account.fromAccountData({ nonce, balance })
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
    await state.putContractCode(kBuf, toBuffer(code))
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

main()
  .then()
  .catch((e: Error) => {
    throw e
  })

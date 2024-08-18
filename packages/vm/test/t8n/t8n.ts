import { Block, createBlock, createBlockHeader } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { RLP } from '@ethereumjs/rlp'
import { createLegacyTxFromBytesArray, createTxFromSerializedData } from '@ethereumjs/tx'
import { Account, bytesToHex, hexToBytes, unprefixedHexToBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { BlockBuilder } from '../../dist/esm/buildBlock.js'
import { VM } from '../../dist/esm/vm.js'
import { getCommon } from '../tester/config.js'
import { makeBlockFromEnv, setupPreConditions } from '../util.js'

import type { PostByzantiumTxReceipt } from '../../dist/esm/types.js'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { NestedUint8Array } from '@ethereumjs/util'

const args = yargs(hideBin(process.argv))
  .option('state.fork', {
    describe: 'Fork to use',
    type: 'string',
  })
  .option('input.alloc', {
    describe: 'Initial state allocation',
    type: 'string',
  })
  .option('inputs.txs', {
    describe: 'RLP input of txs to run on top of the initial state allocation',
    type: 'string',
  })
  .option('inputs.env', {
    describe: 'Input environment (coinbase, difficulty, etc.)',
    type: 'string',
  })
  .option('output.basedir', {
    describe: 'Base directory to write output to',
    type: 'string',
  })
  .option('output.result', {
    describe: 'File to write output results to (relative to `output.basedir`)',
    type: 'string',
  })
  .option('output.alloc', {
    describe: 'File to write output allocation to (after running the transactions)',
    type: 'string',
  }).argv as any
const alloc = JSON.parse(readFileSync(args.input.alloc).toString())
const rlpTxs = JSON.parse(readFileSync(args.input.txs).toString())
const inputEnv = JSON.parse(readFileSync(args.input.env).toString())

const common = getCommon(args.state.fork)

let blockchain
if (args.state.fork === 'Merged') {
  const genesisBlockData = {
    gasLimit: 5000,
    difficulty: 0,
    nonce: hexToBytes('0x0000000000000000'),
    extraData: hexToBytes('0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa'),
  }
  const genesis = createBlock({ header: createBlockHeader(genesisBlockData) })
  blockchain = await createBlockchain({ common, genesisBlock: genesis })
}
const vm = blockchain ? await VM.create({ common, blockchain }) : await VM.create({ common })
await setupPreConditions(vm.stateManager, { pre: alloc })

console.log(inputEnv)

const block = makeBlockFromEnv(inputEnv, { common })

const acc = (await vm.stateManager.getAccount(block.header.coinbase)) ?? new Account()
await vm.stateManager.putAccount(block.header.coinbase, acc)

const txsData = RLP.decode(unprefixedHexToBytes(rlpTxs.slice(2)))

const headerData = block.header.toJSON()
headerData.difficulty = inputEnv.parentDifficulty

const builder = new BlockBuilder(vm, {
  parentBlock: new Block(),
  headerData,
  blockOpts: { putBlockIntoBlockchain: false },
})

const receipts: any = []

let txCounter = 0

vm.events.on('afterTx', async (afterTx: any, continueFn: any) => {
  const receipt = afterTx.receipt as PostByzantiumTxReceipt
  const pushReceipt = {
    root: '0x',
    status: receipt.status === 0 ? '0x' : '0x1',
    cumulativeGasUsed: '0x' + receipt.cumulativeBlockGasUsed.toString(16),
    logsBloom: bytesToHex(receipt.bitvector),
    logs: null,
    transactionHash: bytesToHex(afterTx.transaction.hash()),
    contractAddress: '0x0000000000000000000000000000000000000000',
    gasUsed: '0x' + afterTx.totalGasSpent.toString(16),
    blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    transactionIndex: '0x' + txCounter.toString(16),
  }
  receipts.push(pushReceipt)
  txCounter++
  continueFn!(undefined)
})

const rejected: any = []

let index = 0
for (const txData of txsData as NestedUint8Array) {
  try {
    let tx: TypedTransaction
    if (txData instanceof Uint8Array) {
      tx = createTxFromSerializedData(txData as Uint8Array, { common })
    } else {
      tx = createLegacyTxFromBytesArray(txData as Uint8Array[], { common })
    }
    await builder.addTransaction(tx)
  } catch (e: any) {
    rejected.push({
      index,
      error: e.message,
    })
  }
  index++
}

const logsBloom = builder.logsBloom()
const logsHash = keccak256(logsBloom)

await vm.evm.journal.cleanup()

const output = {
  stateRoot: bytesToHex(await vm.stateManager.getStateRoot()),
  txRoot: bytesToHex(await builder.transactionsTrie()),
  receiptsRoot: bytesToHex(await builder.receiptTrie()),
  logsHash: bytesToHex(logsHash),
  logsBloom: bytesToHex(logsBloom),
  currentDifficulty: '0x20000',
  receipts, // TODO fixme
}

if (rejected.length > 0) {
  ;(output as any).rejected = rejected
}

const outputAlloc = alloc //{}

const outputResultFilePath = join(args.output.basedir, args.output.result)
const outputAllocFilePath = join(args.output.basedir, args.output.alloc)

writeFileSync(outputResultFilePath, JSON.stringify(output))
writeFileSync(outputAllocFilePath, JSON.stringify(outputAlloc))

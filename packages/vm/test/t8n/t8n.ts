import { Block, createBlock, createBlockHeader } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import {
  createLegacyTxFromBytesArray,
  createTxFromSerializedData,
  createTxFromTxData,
} from '@ethereumjs/tx'
import { Account, bigIntToHex, bytesToHex, hexToBytes } from '@ethereumjs/util'
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
import type { TypedTransaction, TypedTxData } from '@ethereumjs/tx'
import type { NestedUint8Array } from '@ethereumjs/util'

function normalizeNumbers(input: any) {
  const keys = [
    'currentGasLimit',
    'currentNumber',
    'currentTimestamp',
    'currentRandom',
    'currentDifficulty',
    'parentDifficulty',
    'parentTimestamp',
    'parentBaseFee',
    'parentGasUsed',
    'parentGasLimit',
    'parentBlobGasUsed',
    'parentExcessBlobGas',
  ]

  for (const key of keys) {
    const value = input[key]
    if (value !== undefined) {
      if (value.substring(0, 2) !== '0x') {
        input[key] = BigInt(value)
      }
    }
  }
  return input
}

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

console.log('ARGS', args)

const alloc = JSON.parse(readFileSync(args.input.alloc).toString())
const txsData = JSON.parse(readFileSync(args.input.txs).toString())
const inputEnv = normalizeNumbers(JSON.parse(readFileSync(args.input.env).toString()))

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

console.log('ALLOC', alloc)
await setupPreConditions(vm.stateManager, { pre: alloc })

const block = makeBlockFromEnv(inputEnv, { common })

const headerData = block.header.toJSON()
headerData.difficulty = inputEnv.parentDifficulty

const builder = new BlockBuilder(vm, {
  parentBlock: new Block(),
  headerData,
  blockOpts: { putBlockIntoBlockchain: false },
})

const receipts: any = []

let txCounter = 0

vm.events.on('afterTx', async (afterTx, continueFn: any) => {
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

for (const txData of txsData) {
  try {
    if (txData.v !== undefined) {
      txData.yParity = txData.v
    }
    if (txData.gas !== undefined) {
      txData.gasLimit = txData.gas
    }

    if (txData.authorizationList !== undefined) {
      txData.authorizationList.map((e: any) => {
        if (e.yParity === undefined) {
          e.yParity = e.v
        }
      })
    }
    if (txData.input !== undefined) {
      txData.data = txData.input
    }
    console.log('TXDATA', txData)
    const tx = createTxFromTxData(txData, { common })
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
  receipts, // TODO fixme
  gasUsed: bigIntToHex(builder.gasUsed),
}

if (rejected.length > 0) {
  ;(output as any).rejected = rejected
}

const outputAlloc = alloc

console.log(output)

const outputResultFilePath = join(args.output.basedir, args.output.result)
const outputAllocFilePath = join(args.output.basedir, args.output.alloc)

writeFileSync(outputResultFilePath, JSON.stringify(output))
writeFileSync(outputAllocFilePath, JSON.stringify(outputAlloc))

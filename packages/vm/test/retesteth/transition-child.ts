import { Block, BlockHeader } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { RLP } from '@ethereumjs/rlp'
import { Transaction, TransactionFactory } from '@ethereumjs/tx'
import { arrToBufArr } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { VM } from '../../src'
import { BlockBuilder } from '../../src/buildBlock'
import { getCommon } from '../tester/config'
import { makeBlockFromEnv, setupPreConditions } from '../util'

import type { PostByzantiumTxReceipt } from '../../src'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { NestedBufferArray } from '@ethereumjs/util'

const yargs = require('yargs/yargs')

async function runTransition(argsIn: any) {
  const args = yargs(argsIn)
    .option('state.fork', {
      describe: 'Fork to use',
    })
    .option('input.alloc', {
      describe: 'Initial state allocation',
    })
    .option('inputs.txs', {
      describe: 'RLP input of txs to run on top of the initial state allocation',
    })
    .option('inputs.env', {
      describe: 'Input environment (coinbase, difficulty, etc.)',
    })
    .option('output.basedir', {
      describe: 'Base directory to write output to',
    })
    .option('output.result', {
      describe: 'File to write output results to (relative to `output.basedir`)',
    })
    .option('output.alloc', {
      describe: 'File to write output allocation to (after running the transactions)',
    }).argv
  const alloc = JSON.parse(readFileSync(args.input.alloc).toString())
  const rlpTxs = JSON.parse(readFileSync(args.input.txs).toString())
  const inputEnv = JSON.parse(readFileSync(args.input.env).toString())

  const common = getCommon(args.state.fork)

  let blockchain
  if (args.state.fork === 'Merged') {
    const genesisBlockData = {
      gasLimit: 5000,
      difficulty: 0,
      nonce: '0x0000000000000000',
      extraData: '0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa',
    }
    const genesis = Block.fromBlockData({ header: BlockHeader.fromHeaderData(genesisBlockData) })
    blockchain = await Blockchain.create({ common, genesisBlock: genesis })
  }
  const vm = blockchain ? await VM.create({ common, blockchain }) : await VM.create({ common })
  await setupPreConditions(<any>vm.eei, { pre: alloc })

  const block = makeBlockFromEnv(inputEnv, { common })

  const txsData = arrToBufArr(RLP.decode(Buffer.from(rlpTxs.slice(2), 'hex')))

  const headerData = block.header.toJSON()
  headerData.difficulty = inputEnv.parentDifficulty

  const builder = new BlockBuilder(vm, {
    parentBlock: new Block(),
    headerData,
    blockOpts: { putBlockIntoBlockchain: false },
  })

  const receipts: any = []

  let txCounter = 0

  vm.events.on('afterTx', async (afterTx, continueFn) => {
    const receipt = <PostByzantiumTxReceipt>afterTx.receipt
    const pushReceipt = {
      root: '0x',
      status: receipt.status === 0 ? '0x' : '0x1',
      cumulativeGasUsed: '0x' + receipt.cumulativeBlockGasUsed.toString(16),
      logsBloom: '0x' + receipt.bitvector.toString('hex'),
      logs: null,
      transactionHash: '0x' + afterTx.transaction.hash().toString('hex'),
      contractAddress: '0x0000000000000000000000000000000000000000',
      gasUsed: '0x' + afterTx.totalGasSpent.toString(16),
      blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      transactionIndex: '0x' + txCounter.toString(16),
    }
    receipts.push(pushReceipt)
    txCounter++
    continueFn!(undefined)
  })

  const rejected = []

  let index = 0
  for (const txData of <NestedBufferArray>txsData) {
    try {
      let tx: TypedTransaction
      if (Buffer.isBuffer(txData)) {
        tx = TransactionFactory.fromSerializedData(txData as Buffer, { common })
      } else {
        tx = Transaction.fromValuesArray(txData as Buffer[], { common })
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
  const logsHash = Buffer.from(keccak256(logsBloom))

  const output = {
    stateRoot: '0x' + (await vm.eei.getStateRoot()).toString('hex'),
    txRoot: '0x' + (await builder.transactionsTrie()).toString('hex'),
    receiptsRoot: '0x' + (await builder.receiptTrie()).toString('hex'),
    logsHash: '0x' + logsHash.toString('hex'),
    logsBloom: '0x' + logsBloom.toString('hex'),
    currentDifficulty: '0x20000',
    receipts, // TODO fixme
  }

  if (rejected.length > 0) {
    ;(<any>output).rejected = rejected
  }

  const outputAlloc = alloc //{}

  const outputResultFilePath = join(args.output.basedir, args.output.result)
  const outputAllocFilePath = join(args.output.basedir, args.output.alloc)

  writeFileSync(outputResultFilePath, JSON.stringify(output))
  writeFileSync(outputAllocFilePath, JSON.stringify(outputAlloc))
}

let running = false

process.on('message', async (message) => {
  if (running) {
    return
  }
  if (message === 'STOP') {
    process.exit()
  } else {
    running = true
    try {
      await runTransition(message)
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.log(e)
    }

    running = false

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (process && process.send) {
      process.send('done')
    }
  }
})

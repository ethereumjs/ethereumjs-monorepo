import { Block } from '@ethereumjs/block'
import { RLP } from '@ethereumjs/rlp'
import { Transaction } from '@ethereumjs/tx'
import { arrToBufArr } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { VM } from '../../src'
import { BlockBuilder } from '../../src/buildBlock'
import { getCommon } from '../tester/config'
import { makeBlockFromEnv, setupPreConditions } from '../util'

import type { PostByzantiumTxReceipt } from '../../src'

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

  const vm = await VM.create({ common })
  await setupPreConditions(<any>vm.eei, { pre: alloc })

  const block = makeBlockFromEnv(inputEnv, { common })

  const txsData = arrToBufArr(RLP.decode(Buffer.from(rlpTxs.slice(2), 'hex')))

  const builder = new BlockBuilder(vm, {
    parentBlock: new Block(),
    headerData: block.header.toJSON(),
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

  for (const txData of txsData) {
    const tx = Transaction.fromValuesArray(<any>txData)
    await builder.addTransaction(tx)
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
  const outputAlloc = alloc //{}

  const outputResultFilePath = join(args.output.basedir, args.output.result)
  const outputAllocFilePath = join(args.output.basedir, args.output.alloc)

  writeFileSync(outputResultFilePath, JSON.stringify(output))
  writeFileSync(outputAllocFilePath, JSON.stringify(outputAlloc))
}

process.on('message', async (message) => {
  if (message === 'STOP') {
    process.exit()
  } else {
    try {
      await runTransition(message)
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.log(e)
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (process && process.send) {
      process.send('done')
    }
  }
})

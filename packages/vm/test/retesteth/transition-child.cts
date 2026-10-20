import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Block, BlockHeader, createBlockFromBlockData } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { RLP } from '@ethereumjs/rlp'
import { createLegacyTxFromBytesArray, createTxFromSerializedData } from '@ethereumjs/tx'
import { Account, bytesToHex, unprefixedHexToBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { BlockBuilder } from '../../dist/cjs/buildBlock.js'
import { VM } from '../../dist/cjs/index.js'
import { getCommon } from '../consensus/legacyCommon.ts'
import { makeBlockFromEnv, setupPreConditions } from '../util.ts'

import type { TypedTransaction } from '@ethereumjs/tx'
import type { NestedUint8Array } from '@ethereumjs/util'
import type { PostByzantiumTxReceipt } from '../../dist/cjs'

import { parseArgs } from 'node:util'

type RetestethCli = {
  state: { fork: string }
  input: { alloc: string; txs: string; env: string }
  output: { basedir: string; result: string; alloc: string }
}

function parseRetestethArgv(argsIn: string[]): RetestethCli {
  const { values } = parseArgs({
    args: argsIn,
    options: {
      'state.fork': { type: 'string' },
      'input.alloc': { type: 'string' },
      'input.txs': { type: 'string' },
      'input.env': { type: 'string' },
      'output.basedir': { type: 'string' },
      'output.result': { type: 'string' },
      'output.alloc': { type: 'string' },
    },
    strict: false,
  })
  return {
    state: { fork: values['state.fork'] as string },
    input: {
      alloc: values['input.alloc'] as string,
      txs: values['input.txs'] as string,
      env: values['input.env'] as string,
    },
    output: {
      basedir: values['output.basedir'] as string,
      result: values['output.result'] as string,
      alloc: values['output.alloc'] as string,
    },
  }
}

async function runTransition(argsIn: string[]) {
  const args = parseRetestethArgv(argsIn)
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
    const genesis = createBlockFromBlockData({
      header: BlockHeader.fromHeaderData(genesisBlockData),
    })
    blockchain = await createBlockchain({ common, genesisBlock: genesis })
  }
  const vm = blockchain ? await VM.create({ common, blockchain }) : await VM.create({ common })
  await setupPreConditions(vm.stateManager, { pre: alloc })

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

  vm.events.on('afterTx', async (afterTx, continueFn) => {
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
    output['rejected'] = rejected
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
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }

    running = false

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (process && process.send) {
      process.send('done')
    }
  }
})

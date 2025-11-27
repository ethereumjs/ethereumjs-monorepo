import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { createBlock } from '@ethereumjs/block'
import { EVMMockBlockchain, NobleBLS } from '@ethereumjs/evm'
import { RLP } from '@ethereumjs/rlp'
import { createTx } from '@ethereumjs/tx'
import { bigIntToHex, bytesToHex, hexToBytes, toBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

import { buildBlock, createVM } from '../../src/index.ts'
import { rewardAccount } from '../../src/runBlock.ts'
import { getCommon } from '../tester/config.ts'
import { makeBlockFromEnv, makeParentBlockHeader, setupPreConditions } from '../util.ts'

import { normalizeNumbers, stepTraceJSON, summaryTraceJSON } from './helpers.ts'
import { StateTracker } from './stateTracker.ts'

import type { Block } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import type { Log } from '@ethereumjs/evm'
import type { TypedTxData } from '@ethereumjs/tx'
import type { CLRequest, CLRequestType, PrefixedHexString } from '@ethereumjs/util'
import type { PostByzantiumTxReceipt } from '../../dist/esm/types.ts'
import type { BlockBuilder, VM } from '../../src/index.ts'
import type { AfterTxEvent } from '../../src/types.ts'
import type { T8NAlloc, T8NEnv, T8NOptions, T8NOutput, T8NReceipt, T8NRejectedTx } from './types.ts'
const kzg = new microEthKZG(trustedSetup)

// Helper methods

/**
 * Returns a blockchain with an overridden "getBlock" method to return the correct block hash
 * @param inputEnv the T8NEnv input, which contains a `blockHashes` list containing the respective block hashes
 * @returns
 */
function getBlockchain(inputEnv: T8NEnv) {
  const blockchain = new EVMMockBlockchain()

  blockchain.getBlock = async function (number?: number) {
    for (const key in inputEnv.blockHashes) {
      if (Number(key) === number) {
        return {
          hash() {
            return new Uint8Array(
              hexToBytes(inputEnv.blockHashes[key] as PrefixedHexString).buffer as ArrayBuffer,
            )
          },
        }
      }
    }
    return {
      hash() {
        return new Uint8Array(32)
      },
    }
  }
  return blockchain
}

/**
 * Normalizes txData to use with EthereumJS keywords. For instance, 1559-txs have `v` fields on the inputs, where EthereumJS expects `yParity`
 * @param txData Array of txData
 * @returns Normalized array of txData
 */
function normalizeTxData(txData: TypedTxData[]) {
  return txData.map((data: any) => {
    if (data.v !== undefined) {
      data.yParity = data.v
    }
    if (data.gas !== undefined) {
      data.gasLimit = data.gas
    }

    if (data.authorizationList !== undefined) {
      data.authorizationList.map((e: any) => {
        if (e.yParity === undefined) {
          e.yParity = e.v
        }
        if (e.yParity === '0x0') {
          e.yParity = '0x'
        }
        if (e.nonce === '0x0') {
          e.nonce = '0x'
        }
        if (e.chainId === '0x0') {
          e.chainId = '0x'
        }
        if (e.r === '0x0') {
          e.r = '0x'
        }
        if (e.s === '0x0') {
          e.s = '0x'
        }
      })
    }
    if (data.input !== undefined) {
      data.data = data.input
    }
    return data as TypedTxData
  })
}

/**
 * This is the TransitionTool class to run transitions. The entire class is marked `private` since
 * it is only intended to be used **once**. To use it, use the single public entrypoint TransitionTool.run(args)
 */
export class TransitionTool {
  public options: T8NOptions

  public alloc: T8NAlloc
  public txsData: TypedTxData[]
  public inputEnv: T8NEnv

  // [txHash, trace]
  private traces: [string, string[]][] = []
  public common!: Common
  public vm!: VM

  public stateTracker!: StateTracker

  // Array of rejected txs
  // These are rejected in case of:
  // (1) The transaction is invalid (for instance, an Authorization List tx does not contain an authorization list)
  // (2) The transaction is rejected by the block builder (for instance, if the sender does not have enough funds to pay)
  public rejected: T8NRejectedTx[]

  // Logs tracker (for logsHash)
  public logs: Log[]

  // Receipt tracker (in t8n format)
  public receipts: T8NReceipt[]

  private constructor(args: T8NOptions) {
    this.options = args

    this.alloc = JSON.parse(readFileSync(args.input.alloc).toString())
    this.txsData = normalizeTxData(JSON.parse(readFileSync(args.input.txs).toString()))
    this.inputEnv = normalizeNumbers(JSON.parse(readFileSync(args.input.env).toString()))

    this.rejected = []
    this.logs = []
    this.receipts = []
  }

  static async run(args: T8NOptions) {
    await new TransitionTool(args).run(args)
  }

  private async run(args: T8NOptions) {
    await this.setup(args)
    // HACK: fix me!
    this.inputEnv.parentUncleHash =
      '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347'
    const block = makeBlockFromEnv(this.inputEnv, { common: this.common })
    const parentBlockHeader = makeParentBlockHeader(this.inputEnv, { common: this.common })
    const parentBlock = createBlock({ header: parentBlockHeader }, { common: this.common })

    const headerData = block.header.toJSON()
    headerData.difficulty = this.inputEnv.parentDifficulty as PrefixedHexString

    const builder = await buildBlock(this.vm, {
      parentBlock,
      headerData,
      blockOpts: { putBlockIntoBlockchain: false },
    })

    let index = 0

    let trace: any[] = []
    // Tracing
    if (args.trace === true) {
      this.vm.events.on('beforeTx', () => {
        trace = []
      })
      this.vm.evm.events?.on('step', (e) => {
        const opTrace = stepTraceJSON(e)
        trace.push(JSON.stringify(opTrace))
      })

      this.vm.events.on('afterTx', async (event) => {
        const summary = await summaryTraceJSON(event, this.vm)
        trace.push(JSON.stringify(summary))
        this.traces[index] = [bytesToHex(event.transaction.hash()), trace]
        this.afterTx(event, index, builder)
      })

      for (const txData of this.txsData) {
        try {
          const tx = createTx(txData, { common: this.common })
          if (!tx.isValid()) {
            throw new Error(tx.getValidationErrors().join(', '))
          }
          // Set `allowNoBlobs` to `true`, since the test might not have the blob
          // The 4844-tx at this should still be valid, since it has the `blobHashes` field
          await builder.addTransaction(tx, { allowNoBlobs: true })
        } catch (e: any) {
          this.rejected.push({
            index,
            error: e.message,
          })
        }
        index++
      }

      // Reward miner

      if (args.state.reward !== BigInt(-1)) {
        await rewardAccount(this.vm.evm, block.header.coinbase, args.state.reward, this.vm.common)
        await this.vm.evm.journal.cleanup()
      }

      const result = await builder.build()

      const convertedOutput = this.getOutput(result.block, result.requests)
      const alloc = await this.stateTracker.dumpAlloc()

      this.writeOutput(args, convertedOutput, alloc)
    }

    this.vm.events.on('afterTx', (event) => {
      this.afterTx(event, index, builder)
    })

    for (const txData of this.txsData) {
      try {
        const tx = createTx(txData, { common: this.common })
        if (!tx.isValid()) {
          throw new Error(tx.getValidationErrors().join(', '))
        }
        // Set `allowNoBlobs` to `true`, since the test might not have the blob
        // The 4844-tx at this should still be valid, since it has the `blobHashes` field
        await builder.addTransaction(tx, { allowNoBlobs: true })
      } catch (e: any) {
        this.rejected.push({
          index,
          error: e.message,
        })
      }
      index++
    }

    // Reward miner

    if (args.state.reward !== BigInt(-1)) {
      await rewardAccount(this.vm.evm, block.header.coinbase, args.state.reward, this.vm.common)
      await this.vm.evm.journal.cleanup()
    }

    const result = await builder.build()

    const convertedOutput = this.getOutput(result.block, result.requests)
    const alloc = await this.stateTracker.dumpAlloc()

    this.writeOutput(args, convertedOutput, alloc)
  }
  private async setup(args: T8NOptions) {
    this.common = getCommon(args.state.fork, kzg)

    const blockchain = getBlockchain(this.inputEnv)

    // Setup BLS
    const evmOpts = {
      bls: new NobleBLS(),
    }
    this.vm = await createVM({ common: this.common, blockchain, evmOpts })
    await setupPreConditions(this.vm.stateManager, { pre: this.alloc })

    this.stateTracker = new StateTracker(this.vm, this.alloc)

    if (args.log === true) {
      this.vm.events.on('beforeTx', (_, resolve) => {
        // eslint-disable-next-line no-console
        console.log('Processing new transaction...')
        resolve?.()
      })
      this.vm.events.on('afterTx', () => {
        // eslint-disable-next-line no-console
        console.log('Done processing transaction (system operations might follow next)')
      })
      this.vm.evm.events?.on('step', (e) => {
        // eslint-disable-next-line no-console
        console.log({
          gasLeft: e.gasLeft.toString(),
          stack: e.stack.map((a) => bigIntToHex(a)),
          opName: e.opcode.name,
          depth: e.depth,
          address: e.address.toString(),
        })
      })
    }
  }

  private afterTx(event: AfterTxEvent, txIndex: number, builder: BlockBuilder) {
    const receipt = event.receipt as PostByzantiumTxReceipt

    const formattedLogs = []
    for (const log of receipt.logs) {
      this.logs.push(log)

      const entry: any = {
        address: bytesToHex(log[0]),
        topics: log[1].map((e) => bytesToHex(e)),
        data: bytesToHex(log[2]),
        blockNumber: bytesToHex(toBytes(builder['headerData'].number)),
        transactionHash: bytesToHex(event.transaction.hash()),
        transactionIndex: bigIntToHex(BigInt(txIndex)),
        blockHash: bytesToHex(new Uint8Array(32)),
        logIndex: bigIntToHex(BigInt(formattedLogs.length)),
        removed: 'false',
      }
      formattedLogs.push(entry)
    }

    this.receipts.push({
      root: '0x',
      status: receipt.status === 0 ? '0x0' : '0x1',
      cumulativeGasUsed: '0x' + receipt.cumulativeBlockGasUsed.toString(16),
      logsBloom: bytesToHex(receipt.bitvector),
      logs: formattedLogs,
      transactionHash: bytesToHex(event.transaction.hash()),
      contractAddress: '0x0000000000000000000000000000000000000000',
      gasUsed: '0x' + event.totalGasSpent.toString(16),
      blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      transactionIndex: bigIntToHex(BigInt(txIndex)),
    })
  }

  private getOutput(block: Block, requests?: CLRequest<CLRequestType>[]): T8NOutput {
    const output: T8NOutput = {
      stateRoot: bytesToHex(block.header.stateRoot),
      txRoot: bytesToHex(block.header.transactionsTrie),
      receiptsRoot: bytesToHex(block.header.receiptTrie),
      logsHash: bytesToHex(keccak_256(RLP.encode(this.logs))),
      logsBloom: bytesToHex(block.header.logsBloom),
      receipts: this.receipts,
      gasUsed: bigIntToHex(block.header.gasUsed),
    }

    if (block.header.baseFeePerGas !== undefined) {
      output.currentBaseFee = bigIntToHex(block.header.baseFeePerGas)
    }

    if (block.header.withdrawalsRoot !== undefined) {
      output.withdrawalsRoot = bytesToHex(block.header.withdrawalsRoot)
    }

    if (block.header.blobGasUsed !== undefined) {
      output.blobGasUsed = bigIntToHex(block.header.blobGasUsed)
    }

    if (block.header.excessBlobGas !== undefined) {
      output.currentExcessBlobGas = bigIntToHex(block.header.excessBlobGas)
    }

    if (block.header.requestsHash !== undefined) {
      output.requestsHash = bytesToHex(block.header.requestsHash)
    }

    if (requests !== undefined) {
      // NOTE: EEST currently wants the raw request bytes, **excluding** the type
      output.requests = []
      for (const request of requests) {
        if (request.bytes.length > 1) {
          output.requests.push(bytesToHex(request.bytes))
        }
      }
    }

    if (this.rejected.length > 0) {
      output.rejected = this.rejected
    }

    return output
  }

  private writeOutput(args: T8NOptions, output: T8NOutput, outputAlloc: T8NAlloc) {
    const outputResultFilePath = join(args.output.basedir, args.output.result)
    const outputAllocFilePath = join(args.output.basedir, args.output.alloc)
    writeFileSync(outputResultFilePath, JSON.stringify(output))
    writeFileSync(outputAllocFilePath, JSON.stringify(outputAlloc))
    if (args.trace === true) {
      for (let i = 0; i < this.traces.length; i++) {
        const tracePath = join(args.output.basedir, `trace-${i}-${this.traces[i][0]}.jsonl`)
        writeFileSync(tracePath, `${this.traces[i][1].join('\n')}`)
      }
    }
  }
}

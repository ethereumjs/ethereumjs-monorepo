import { Block } from '@ethereumjs/block'
import { EVMMockBlockchain, MCLBLS } from '@ethereumjs/evm'
import { RLP } from '@ethereumjs/rlp'
import { TransactionType, TxData, createTxFromTxData } from '@ethereumjs/tx'
import {
  Account,
  BIGINT_1,
  CLRequestType,
  bigIntToHex,
  createAddressFromString,
  hexToBytes,
  toBytes,
  zeros,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex } from 'ethereum-cryptography/utils'
import { readFileSync } from 'fs'
import { loadKZG } from 'kzg-wasm'
import * as mcl from 'mcl-wasm'

import { buildBlock } from '../../dist/esm/buildBlock.js'
import { createVM } from '../../dist/esm/constructors.js'
import { getCommon } from '../tester/config.js'
import { makeBlockFromEnv, setupPreConditions } from '../util.js'

import { normalizeNumbers } from './helpers.js'

import type { PostByzantiumTxReceipt } from '../../dist/esm/types.js'
import type { VM } from '../../dist/esm/vm.js'
import type { RunnerOptions, T8NAlloc, T8NEnv, T8NOptions } from './types.js'
import type { Common } from '@ethereumjs/common'
import type { Log } from '@ethereumjs/evm'
import type { TypedTxData } from '@ethereumjs/tx'
import type { Address } from '@ethereumjs/util'

export class TransitionTool {
  public options: T8NOptions

  public alloc: T8NAlloc
  public txsData: TypedTxData[]
  public inputEnv: T8NEnv

  public common!: Common
  public stateTracker!: StateTracker

  private constructor(args: T8NOptions) {
    this.options = args

    this.alloc = JSON.parse(readFileSync(args.input.alloc).toString())
    this.txsData = JSON.parse(readFileSync(args.input.txs).toString())
    this.inputEnv = normalizeNumbers(JSON.parse(readFileSync(args.input.env).toString()))
  }

  static async init(args: T8NOptions, runnerOptions: RunnerOptions = {}) {
    const t8nTool = new TransitionTool(args)
    t8nTool.common = getCommon(args.state.fork, await loadKZG())

    const common = t8nTool.common

    const blockchain = new EVMMockBlockchain()

    // Override `getBlock` to ensure `BLOCKHASH` works as expected (reads from `inputEnv.blockHashes`)
    blockchain.getBlock = async function (number?: Number) {
      for (const key in t8nTool.inputEnv.blockHashes) {
        if (Number(key) === number) {
          return {
            hash() {
              return hexToBytes(t8nTool.inputEnv.blockHashes[key])
            },
          }
        }
      }
      // Hash not found, so return the zero hash
      return {
        hash() {
          return zeros(32)
        },
      }
    }

    await mcl.init(mcl.BLS12_381)
    const bls = new MCLBLS(mcl)
    const evmOpts = {
      bls,
    }

    const vm = await createVM({ common: t8nTool.common, blockchain, evmOpts })

    t8nTool.stateTracker = new StateTracker(vm, t8nTool.alloc)

    await setupPreConditions(vm.stateManager, { pre: t8nTool.alloc })

    const block = makeBlockFromEnv(t8nTool.inputEnv, { common: t8nTool.common })

    const headerData = block.header.toJSON()
    headerData.difficulty = bigIntToHex(BigInt(t8nTool.inputEnv.parentDifficulty))

    const builder = await buildBlock(vm, {
      parentBlock: new Block(),
      headerData,
      blockOpts: { putBlockIntoBlockchain: false },
    })

    // TODO: add state.reward
    //const acc = (await vm.stateManager.getAccount(block.header.coinbase)) ?? new Account()
    //await vm.stateManager.putAccount(block.header.coinbase, acc)

    const receipts: any = []

    const log = runnerOptions.log === true

    const logsBuilder: Log[] = []

    let txIndex = -BIGINT_1

    vm.events.on('afterTx', async (afterTx, continueFn: any) => {
      txIndex++
      const receipt = afterTx.receipt as PostByzantiumTxReceipt

      const formattedLogs = []
      for (const log of receipt.logs) {
        logsBuilder.push(log)

        const entry: any = {
          address: bytesToHex(log[0]),
          topics: log[1].map((e) => bytesToHex(e)),
          data: bytesToHex(log[2]),
          blockNumber: bytesToHex(toBytes(builder['headerData'].number)),
          transactionHash: bytesToHex(afterTx.transaction.hash()),
          transactionIndex: bigIntToHex(txIndex),
          blockHash: bytesToHex(zeros(32)),
          logIndex: bigIntToHex(BigInt(formattedLogs.length)),
          removed: 'false',
        }
        formattedLogs.push(entry)
      }

      const pushReceipt = {
        root: '0x',
        status: receipt.status === 0 ? '0x0' : '0x1',
        cumulativeGasUsed: '0x' + receipt.cumulativeBlockGasUsed.toString(16),
        logsBloom: bytesToHex(receipt.bitvector),
        logs: formattedLogs,
        transactionHash: bytesToHex(afterTx.transaction.hash()),
        contractAddress: '0x0000000000000000000000000000000000000000',
        gasUsed: '0x' + afterTx.totalGasSpent.toString(16),
        blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        transactionIndex: bigIntToHex(txIndex),
      }
      receipts.push(pushReceipt)
      continueFn!(undefined)
    })

    vm.evm.events?.on('step', (e) => {
      if (log) {
        console.log({
          gas: Number(e.gasLeft).toString(16),
          stack: e.stack.map((a) => a.toString(16)),
          opName: e.opcode.name,
        })
      }
    })

    const rejected: any = []

    let index = 0

    for (const txData of t8nTool.txsData) {
      try {
        if (txData.v !== undefined) {
          ;(<any>txData).yParity = txData.v
        }
        if ((<any>txData).gas !== undefined) {
          txData.gasLimit = (<any>txData).txData.gas
        }

        if ((<any>txData).txData.authorizationList !== undefined) {
          ;(<any>txData).txData.authorizationList.map((e: any) => {
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
        if ((<any>txData).txData.input !== undefined) {
          txData.data = (<any>txData).input
        }
        const tx = createTxFromTxData(txData, { common: t8nTool.common })
        await builder.addTransaction(tx, { allowNoBlobs: true })
      } catch (e: any) {
        rejected.push({
          index,
          error: e.message,
        })
      }
      index++
    }

    await vm.evm.journal.cleanup()

    if (t8nTool.options.state.reward !== -BIGINT_1) {
      const coinbase = (await vm.stateManager.getAccount(block.header.coinbase)) ?? new Account()
      coinbase.balance += t8nTool.options.state.reward
      await vm.stateManager.putAccount(block.header.coinbase, coinbase)
    }

    const result = await builder.build()

    const output = {
      stateRoot: bytesToHex(result.header.stateRoot),
      txRoot: bytesToHex(result.header.transactionsTrie),
      receiptsRoot: bytesToHex(result.header.receiptTrie),
      logsHash: bytesToHex(keccak256(RLP.encode(logsBuilder))),
      logsBloom: bytesToHex(result.header.logsBloom),
      receipts,
      gasUsed: bigIntToHex(builder.gasUsed),
    }

    if (result.header.baseFeePerGas !== undefined) {
      ;(output as any).currentBaseFee = bigIntToHex(result.header.baseFeePerGas)
    }

    if (result.header.withdrawalsRoot !== undefined) {
      ;(output as any).withdrawalsRoot = bytesToHex(result.header.withdrawalsRoot)
    }

    if (result.header.blobGasUsed !== undefined) {
      ;(output as any).blobGasUsed = bigIntToHex(result.header.blobGasUsed)
    }

    if (result.header.excessBlobGas !== undefined) {
      ;(output as any).currentExcessBlobGas = bigIntToHex(result.header.excessBlobGas)
    }

    if (result.header.requestsRoot !== undefined) {
      ;(output as any).requestsRoot = bytesToHex(result.header.requestsRoot)
    }

    if (result.requests !== undefined) {
      if (common.isActivatedEIP(6110)) {
        ;(output as any).depositRequests = []
      }

      if (common.isActivatedEIP(7002)) {
        ;(output as any).withdrawalRequests = []
      }

      if (common.isActivatedEIP(7251)) {
        ;(output as any).consolidationRequests = []
      }

      for (const request of result.requests) {
        if (request.type === CLRequestType.Deposit) {
          ;(output as any).depositRequests.push(request.toJSON())
        } else if (request.type === CLRequestType.Withdrawal) {
          ;(output as any).withdrawalRequests.push(request.toJSON())
        } else if (request.type === CLRequestType.Consolidation) {
          ;(output as any).consolidationRequests.push(request.toJSON())
        }
      }
    }

    if (rejected.length > 0) {
      ;(output as any).rejected = rejected
    }
  }
}

class StateTracker {
  private allocTracker: {
    [address: string]: {
      storage: string[]
    }
  } = {}

  private alloc: T8NAlloc

  private vm: VM

  constructor(vm: VM, alloc: T8NAlloc) {
    this.alloc = alloc
    const originalPutAccount = vm.stateManager.putAccount
    const originalPutCode = vm.stateManager.putCode
    const originalPutStorage = vm.stateManager.putStorage

    this.vm = vm

    const self = this

    vm.stateManager.putAccount = async function (...args: any) {
      const address = <Address>args[0]
      self.addAddress(address.toString())
      await originalPutAccount.apply(this, args)
    }

    vm.stateManager.putAccount = async function (...args: any) {
      const address = <Address>args[0]
      self.addAddress(address.toString())
      return originalPutAccount.apply(this, args)
    }

    vm.stateManager.putCode = async function (...args: any) {
      const address = <Address>args[0]
      self.addAddress(address.toString())
      return originalPutCode.apply(this, args)
    }

    vm.stateManager.putStorage = async function (...args: any) {
      const address = <Address>args[0]
      const key = <Uint8Array>args[1]
      self.addStorage(address.toString(), bytesToHex(key))
      return originalPutStorage.apply(this, args)
    }
  }

  addAddress(address: string) {
    if (this.allocTracker[address] === undefined) {
      this.allocTracker[address] = { storage: [] }
    }
    return this.allocTracker[address]
  }

  addStorage(address: string, storage: string) {
    const storageList = this.addAddress(address).storage
    if (!storageList.includes(storage)) {
      storageList.push(storage)
    }
  }

  public async dumpAlloc() {
    // Build output alloc
    const alloc = this.alloc
    for (const addressString in this.allocTracker) {
      const address = createAddressFromString(addressString)
      const account = await this.vm.stateManager.getAccount(address)
      if (account === undefined) {
        delete alloc[addressString]
        continue
      }
      if (alloc[addressString] === undefined) {
        alloc[addressString] = { balance: '0x0 ' }
      }
      alloc[addressString].nonce = bigIntToHex(account.nonce)
      alloc[addressString].balance = bigIntToHex(account.balance)
      alloc[addressString].code = bytesToHex(await vm.stateManager.getCode(address))

      const storage = allocTracker[addressString].storage
      alloc[addressString].storage = alloc[addressString].storage ?? {}

      for (const key of storage) {
        const keyBytes = hexToBytes(<PrefixedHexString>key)
        let storageKeyTrimmed = bytesToHex(unpadBytes(keyBytes))
        if (storageKeyTrimmed === '0x') {
          storageKeyTrimmed = '0x00'
        }
        const value = await vm.stateManager.getStorage(address, setLengthLeft(keyBytes, 32))
        if (value.length === 0) {
          delete alloc[addressString].storage[storageKeyTrimmed]
          // To be sure, also delete any keys which are left-padded to 32 bytes
          delete alloc[addressString].storage[key]
          continue
        }
        alloc[addressString].storage[storageKeyTrimmed] = bytesToHex(value)
      }
    }
  }
}

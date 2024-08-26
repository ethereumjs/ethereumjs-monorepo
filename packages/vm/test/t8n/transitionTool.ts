import { Address, hexToBytes, zeros } from '@ethereumjs/util'
import { bytesToHex } from 'ethereum-cryptography/utils'
import { EVMMockBlockchain, MCLBLS } from '@ethereumjs/evm'
import { TransactionType, TxData } from '@ethereumjs/tx'
import { readFileSync } from 'fs'
import { loadKZG } from 'kzg-wasm'
import * as mcl from 'mcl-wasm'

import { VM } from '../../src/vm.js'
import { getCommon } from '../tester/config.js'
import { makeBlockFromEnv, setupPreConditions } from '../util.js'

import { normalizeNumbers } from './helpers.js'

import type { T8NAlloc, T8NEnv, T8NOptions } from './types.js'
import type { Common } from '@ethereumjs/common'
import type { TypedTxData } from '@ethereumjs/tx'

export class TransitionTool {
  public options: T8NOptions

  public alloc: T8NAlloc
  public txsData: TypedTxData[]
  public inputEnv: T8NEnv

  public common!: Common

  private constructor(args: T8NOptions) {
    this.options = args

    this.alloc = JSON.parse(readFileSync(args.input.alloc).toString())
    this.txsData = JSON.parse(readFileSync(args.input.txs).toString())
    this.inputEnv = normalizeNumbers(JSON.parse(readFileSync(args.input.env).toString()))
  }

  static async init(args: T8NOptions) {
    const t8nTool = new TransitionTool(args)
    t8nTool.common = getCommon(args.state.fork, await loadKZG())

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

    const vm = await VM.create({ common: t8nTool.common, blockchain, evmOpts })

    await setupPreConditions(vm.stateManager, { pre: t8nTool.alloc })

    const block = makeBlockFromEnv(t8nTool.inputEnv, { common: t8nTool.common })
  }
}

class StateTracker {
  private allocTracker: {
    [address: string]: {
      storage: string[]
    }
  } = {}

  private constructor(vm: VM) {
    const originalPutAccount = vm.stateManager.putAccount
    const originalPutCode = vm.stateManager.putCode
    const originalPutStorage = vm.stateManager.putStorage

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

  static async init(vm: VM) {}

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
}

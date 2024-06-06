import { Hardfork } from '@ethereumjs/common'

import { Account, Address, AsyncEventEmitter, BIGINT_0 } from '@ethereumjs/util'
import { EVM, OOGResult, defaultBlock } from './evm'

import { Message, MessageWithTo } from './message'
import { ERROR } from './exceptions'
import { Interpreter, InterpreterOpts } from './interpreter'
import { Journal } from './journal'
import { getOpcodesForHF } from './opcodes/index.js'
import { TransientStorage } from './transientStorage'
import { Blockchain } from './types'

import type { Env } from './interpreter'
import type { AsyncDynamicGasHandler, SyncDynamicGasHandler } from './opcodes/gas'
import type { OpHandler, OpcodeList, OpcodeMap } from './opcodes/index.js'
import type {
  CustomOpcode,
  EVMEvents,
  EVMOpts,
  EVMResult,
  EVMRunCallOpts,
  ExecResult,
} from './types'
import type { Block } from './types.js'
import type { Common } from '@ethereumjs/common'
import { EVMPerformanceLogger } from './logger'

class NullStateManager {
  getAccount() {
    throw new Error('Getting account is not supported with a Pure Interpreter')
  }
  putContractStorage() {
    throw new Error('Putting contract storage is not supported with a Pure Interpreter')
  }
  originalStorageCache = new Map()
  getContractStorage() {
    throw new Error('Getting contract storage is not supported with a Pure Interpreter')
  }
  modifyAccountFields() {
    throw new Error('Modifying account fields is not supported with a Pure Interpreter')
  }
}

class NullBlockchain {}

/**
 * EVM instance that has no state
 * Used to create a pure interpreter
 */
class NullEVM {
  // as any because we didn't properly fill out entire interface in this poc
  public readonly stateManager = new NullStateManager() as any
  // as any because we didn't properly fill out entire interface in this poc
  public readonly blockchain = new NullBlockchain() as any
  protected readonly _optsCached: EVMOpts = {}
  journal: Journal
  constructor(public readonly common: Common) {
    this.journal = new Journal(this.stateManager, this.common)
  }
  protected _customOpcodes?: CustomOpcode[] | undefined = []
  public readonly DEBUG = false
  public readonly events = new AsyncEventEmitter<EVMEvents>()
  protected _opcodeMap!: OpcodeMap
  protected _opcodes!: OpcodeList
  protected _dynamicGasHandlers!: Map<number, AsyncDynamicGasHandler | SyncDynamicGasHandler>
  protected _handlers!: Map<number, OpHandler>
  protected _block?: Block
  public async _emit(topic: string, data: any): Promise<void> {
    return new Promise((resolve) => this.events.emit(topic as keyof EVMEvents, data, resolve))
  }
  protected _tx?: {
    gasPrice: bigint
    origin: Address
  }
  transientStorage = new TransientStorage()
  async runCall(opts: EVMRunCallOpts): Promise<EVMResult> {
    // commented out just to save time making poc
    // let timer: Timer | undefined
    // if (
    //   (opts.depth === 0 || opts.message === undefined) &&
    //  this._optsCached.profiler?.enabled === true
    // ) {
    // timer = this.performanceLogger.startTimer('Initialization')
    // }
    let message = opts.message
    // let callerAccount
    if (!message) {
      // this should be a null block that throws errors actully
      this._block = defaultBlock()
      this._tx = {
        gasPrice: opts.gasPrice ?? BIGINT_0,
        origin: opts.origin ?? opts.caller ?? Address.zero(),
      }
      const caller = opts.caller ?? Address.zero()

      const value = opts.value ?? BIGINT_0
      // ignore skip balance for now
      // if (opts.skipBalance === true) {
      // callerAccount = await this.stateManager.getAccount(caller)
      // if (!callerAccount) {
      // callerAccount = new Account()
      // }
      // if (callerAccount.balance < value) {
      // if skipBalance and balance less than value, set caller balance to `value` to ensure sufficient funds
      // callerAccount.balance = value
      // await this.journal.putAccount(caller, callerAccount)
      // }
      // }

      message = new Message({
        caller,
        gasLimit: opts.gasLimit ?? BigInt(0xffffff),
        to: opts.to,
        value,
        data: opts.data,
        code: opts.code,
        depth: opts.depth,
        isCompiled: opts.isCompiled,
        isStatic: opts.isStatic,
        salt: opts.salt,
        selfdestruct: opts.selfdestruct ?? new Set(),
        createdAddresses: opts.createdAddresses ?? new Set(),
        delegatecall: opts.delegatecall,
        blobVersionedHashes: opts.blobVersionedHashes,
        accessWitness: opts.accessWitness,
      })
    }

    // don't obther updating nonces
    // if (message.depth === 0) {
    // if (!callerAccount) {
    // callerAccount = await this.stateManager.getAccount(message.caller)
    // }
    // if (!callerAccount) {
    // callerAccount = new Account()
    // }
    // callerAccount.nonce++
    // await this.journal.putAccount(message.caller, callerAccount)
    // if (this.DEBUG) {
    // debug(`Update fromAccount (caller) nonce (-> ${callerAccount.nonce}))`)
    // }
    // }

    await this._emit('beforeMessage', message)

    // cannot create in a pure interprter
    // if (!message.to && this.common.isActivatedEIP(2929)) {
    // message.code = message.data
    // this.journal.addWarmedAddress((await this._generateAddress(message)).bytes)
    // }

    await this.journal.checkpoint()
    if (this.common.isActivatedEIP(1153)) this.transientStorage.checkpoint()
    // if (this.DEBUG) {
    // debug('-'.repeat(100))
    // debug(`message checkpoint`)
    // }

    let result
    // if (this.DEBUG) {
    // const { caller, gasLimit, to, value, delegatecall } = message
    // debug(
    // `New message caller=${caller} gasLimit=${gasLimit} to=${
    // to?.toString() ?? 'none'
    // } value=${value} delegatecall=${delegatecall ? 'yes' : 'no'}`
    // )
    // }
    // if (message.to) {
    // if (this.DEBUG) {
    // debug(`Message CALL execution (to: ${message.to})`)
    // }
    result = await this._executeCall(message as MessageWithTo)
    // }
    // pure interpreter cannot create
    // else {
    // if (this.DEBUG) {
    // debug(`Message CREATE execution (to undefined)`)
    // }
    // result = await this._executeCreate(message)
    // }
    // if (this.DEBUG) {
    // const { executionGasUsed, exceptionError, returnValue } = result.execResult
    // debug(
    // `Received message execResult: [ gasUsed=${executionGasUsed} exceptionError=${
    // exceptionError ? `'${exceptionError.error}'` : 'none'
    // } returnValue=${short(returnValue)} gasRefund=${result.execResult.gasRefund ?? 0} ]`
    // )
    // }
    const err = result.execResult.exceptionError
    // This clause captures any error which happened during execution
    // If that is the case, then all refunds are forfeited
    // There is one exception: if the CODESTORE_OUT_OF_GAS error is thrown
    // (this only happens the Frontier/Chainstart fork)
    // then the error is dismissed
    if (err && err.error !== ERROR.CODESTORE_OUT_OF_GAS) {
      result.execResult.selfdestruct = new Set()
      result.execResult.createdAddresses = new Set()
      result.execResult.gasRefund = BIGINT_0
    }
    if (
      err &&
      !(this.common.hardfork() === Hardfork.Chainstart && err.error === ERROR.CODESTORE_OUT_OF_GAS)
    ) {
      result.execResult.logs = []
      await this.journal.revert()
      if (this.common.isActivatedEIP(1153)) this.transientStorage.revert()
      // if (this.DEBUG) {
      // debug(`message checkpoint reverted`)
      // }
    } else {
      await this.journal.commit()
      if (this.common.isActivatedEIP(1153)) this.transientStorage.commit()
      // if (this.DEBUG) {
      // debug(`message checkpoint committed`)
      // }
    }
    await this._emit('afterMessage', result)

    // if (message.depth === 0 && this._optsCached.profiler?.enabled === true) {
    // this.performanceLogger.stopTimer(timer!, 0)
    // }

    return result
  }
  allowUnlimitedContractSize = false
  /**
   * Returns a list with the currently activated opcodes
   * available for EVM execution
   */
  getActiveOpcodes(): OpcodeList {
    const data = getOpcodesForHF(this.common, this._customOpcodes)
    this._opcodes = data.opcodes
    this._dynamicGasHandlers = data.dynamicGasHandlers
    this._handlers = data.handlers
    this._opcodeMap = data.opcodeMap
    return data.opcodes
  }
  protected async _executeCall(message: MessageWithTo): Promise<EVMResult> {
    let gasLimit = message.gasLimit
    const fromAddress = message.authcallOrigin ?? message.caller

    if (this.common.isActivatedEIP(6800)) {
      const sendsValue = message.value !== BIGINT_0
      // if (message.depth === 0) {
      // const originAccessGas = message.accessWitness!.touchTxOriginAndComputeGas(fromAddress)
      // debugGas(`originAccessGas=${originAccessGas} waived off for origin at depth=0`)

      // const destAccessGas = message.accessWitness!.touchTxTargetAndComputeGas(message.to, {
      // sendsValue,
      // })
      // debugGas(`destAccessGas=${destAccessGas} waived off for target at depth=0`)
      // }

      let callAccessGas = message.accessWitness!.touchAndChargeMessageCall(message.to)
      if (sendsValue) {
        callAccessGas += message.accessWitness!.touchAndChargeValueTransfer(fromAddress, message.to)
      }
      gasLimit -= callAccessGas
      if (gasLimit < BIGINT_0) {
        // if (this.DEBUG) {
        // debugGas(`callAccessGas charged(${callAccessGas}) caused OOG (-> ${gasLimit})`)
        // }
        return { execResult: OOGResult(message.gasLimit) }
      } else {
        // if (this.DEBUG) {
        // debugGas(`callAccessGas used (${callAccessGas} gas (-> ${gasLimit}))`)
        // }
      }
    }

    // let account = await this.stateManager.getAccount(fromAddress)
    // if (!account) {
    const account = new Account()
    // }
    let errorMessage
    // Reduce tx value from sender
    //jif (!message.delegatecall) {
    //try {
    //await this._reduceSenderBalance(account, message)
    //} catch (e) {
    //errorMessage = e
    //}
    //}

    // Load `to` account
    //let toAccount = await this.stateManager.getAccount(message.to)
    //if (!toAccount) {
    // if (this.common.isActivatedEIP(6800)) {
    //  const absenceProofAccessGas = message.accessWitness!.touchAndChargeProofOfAbsence(
    //   message.to
    //)
    //gasLimit -= absenceProofAccessGas
    //if (gasLimit < BIGINT_0) {
    //if (this.DEBUG) {
    //debugGas(
    //`Proof of absense access charged(${absenceProofAccessGas}) caused OOG (-> ${gasLimit})`
    //)
    //}
    //return { execResult: OOGResult(message.gasLimit) }
    //} else {
    // if (this.DEBUG) {
    //  debugGas(`Proof of absense access used (${absenceProofAccessGas} gas (-> ${gasLimit}))`)
    //          }
    //       }
    //    }
    //   toAccount = new Account()
    //}
    // Add tx value to the `to` account
    //    if (!message.delegatecall) {
    //     try {
    //      await this._addToBalance(toAccount, message)
    //   } catch (e: any) {
    //    errorMessage = e
    // }
    //    }

    // COmmented out because message should already have code
    // // Load code
    // await this._loadCode(message)
    // let exit = false
    // if (!message.code || (typeof message.code !== 'function' && message.code.length === 0)) {
    // exit = true
    // if (this.DEBUG) {
    // debug(`Exit early on no code (CALL)`)
    // }
    // }
    // if (errorMessage !== undefined) {
    // exit = true
    // if (this.DEBUG) {
    // debug(`Exit early on value transfer overflowed (CALL)`)
    // }
    // }
    // if (exit) {
    // return {
    // execResult: {
    // gasRefund: message.gasRefund,
    // executionGasUsed: message.gasLimit - gasLimit,
    // exceptionError: errorMessage, // Only defined if addToBalance failed
    // returnValue: new Uint8Array(0),
    // },
    // }
    // }

    let result: ExecResult

    if (message.isCompiled) {
      // deleted entire code block just to move faster since this is a poc
      throw new Error('Nope')
    } else {
      // if (this.DEBUG) {
      // debug(`Start bytecode processing...`)
      // }
      result = await this.runInterpreter({ ...message, gasLimit } as Message)
    }

    // i shouldn't have commented this out but just in a rush
    // if (message.depth === 0) {
    // this.postMessageCleanup()
    // }

    // result.executionGasUsed += message.gasLimit - gasLimit

    return {
      execResult: result,
    }
  }

  /**
   * Starts the actual bytecode processing for a CALL or CREATE
   */
  protected async runInterpreter(
    message: Message,
    opts: InterpreterOpts = {}
  ): Promise<ExecResult> {
    // jlet contract = await this.stateManager.getAccount(message.to ?? Address.zero())
    // if (!contract) {
    // contract = new Account()
    // }

    const env = {
      address: message.to ?? Address.zero(),
      caller: message.caller ?? Address.zero(),
      callData: message.data ?? Uint8Array.from([0]),
      callValue: message.value ?? BIGINT_0,
      code: message.code as Uint8Array,
      isStatic: message.isStatic ?? false,
      depth: message.depth ?? 0,
      gasPrice: this._tx!.gasPrice,
      origin: this._tx!.origin ?? message.caller ?? Address.zero(),
      block: this._block ?? defaultBlock(),
      // contract,
      contract: new Account(),
      codeAddress: message.codeAddress,
      gasRefund: message.gasRefund,
      containerCode: message.containerCode,
      chargeCodeAccesses: message.chargeCodeAccesses,
      blobVersionedHashes: message.blobVersionedHashes ?? [],
      accessWitness: message.accessWitness,
      createdAddresses: message.createdAddresses,
    }

    const interpreter = new Interpreter(
      this as any,
      this.stateManager,
      this.blockchain,
      env,
      message.gasLimit,
      this.journal,
      // Ideally we could remove this from bundle
      new EVMPerformanceLogger(),
      this._optsCached.profiler
    )
    if (message.selfdestruct) {
      interpreter._result.selfdestruct = message.selfdestruct
    }
    if (message.createdAddresses) {
      interpreter._result.createdAddresses = message.createdAddresses
    }

    const interpreterRes = await interpreter.run(message.code as Uint8Array, opts)

    let result = interpreter._result
    let gasUsed = message.gasLimit - interpreterRes.runState!.gasLeft
    if (interpreterRes.exceptionError) {
      if (
        interpreterRes.exceptionError.error !== ERROR.REVERT &&
        interpreterRes.exceptionError.error !== ERROR.INVALID_EOF_FORMAT
      ) {
        gasUsed = message.gasLimit
      }

      // Clear the result on error
      result = {
        ...result,
        logs: [],
        selfdestruct: new Set(),
        createdAddresses: new Set(),
      }
    }

    return {
      ...result,
      runState: {
        ...interpreterRes.runState!,
        ...result,
        ...interpreter._env,
      },
      exceptionError: interpreterRes.exceptionError,
      gas: interpreterRes.runState?.gasLeft,
      executionGasUsed: gasUsed,
      gasRefund: interpreterRes.runState!.gasRefund,
      returnValue: result.returnValue ? result.returnValue : new Uint8Array(0),
    }
  }
}

/**
 * A PureInterpreter is a minimal EVM instance that has no state and can only execute
 * pure functions. This is useful in browser for executing pure functions with an absolute
 * minimal bundle size overhead.
 *
 * This implementation is quick and hacky. We could do a much cleaner version
 */
export class PureInterpreter extends Interpreter {
  constructor(common: Common, env: Env, gasLimit: bigint) {
    const evm = new NullEVM(common)
    super(
      evm as any,
      evm.stateManager,
      evm.blockchain,
      env,
      gasLimit,
      evm.journal,
      // Ideally we would be able to remove this from bundler
      new EVMPerformanceLogger()
    )
  }
}

import { Block } from '@ethereumjs/block'
import { ConsensusType, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { BlobEIP4844Transaction, Capability, isBlobEIP4844Tx } from '@ethereumjs/tx'
import {
  Account,
  Address,
  BIGINT_0,
  KECCAK256_NULL,
  bytesToBigInt,
  bytesToHex,
  bytesToUnprefixedHex,
  concatBytes,
  ecrecover,
  equalsBytes,
  hexToBytes,
  publicToAddress,
  short,
} from '@ethereumjs/util'
import debugDefault from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { Bloom } from './bloom/index.js'

import type {
  AfterTxEvent,
  BaseTxReceipt,
  EIP4844BlobTxReceipt,
  PostByzantiumTxReceipt,
  PreByzantiumTxReceipt,
  RunTxOpts,
  RunTxResult,
  TxReceipt,
} from './types.js'
import type { VM } from './vm.js'
import type { AccessList, AccessListItem, Common } from '@ethereumjs/common'
import type { EVM } from '@ethereumjs/evm'
import type {
  AccessListEIP2930Transaction,
  EIP7702CompatibleTx,
  FeeMarketEIP1559Transaction,
  LegacyTransaction,
  TypedTransaction,
} from '@ethereumjs/tx'

const debug = debugDefault('vm:tx')
const debugGas = debugDefault('vm:tx:gas')

let enableProfiler = false
const initLabel = 'EVM journal init, address/slot warming, fee validation'
const balanceNonceLabel = 'Balance/Nonce checks and update'
const executionLabel = 'Execution'
const logsGasBalanceLabel = 'Logs, gas usage, account/miner balances'
const accountsCleanUpLabel = 'Accounts clean up'
const accessListLabel = 'Access list label'
const journalCacheCleanUpLabel = 'Journal/cache cleanup'
const receiptsLabel = 'Receipts'
const entireTxLabel = 'Entire tx'

/**
 * Returns the hardfork excluding the merge hf which has
 * no effect on the vm execution capabilities.
 *
 * This is particularly useful in executing/evaluating the transaction
 * when chain td is not available at many places to correctly set the
 * hardfork in for e.g. vm or txs or when the chain is not fully synced yet.
 *
 * @returns Hardfork name
 */
function execHardfork(
  hardfork: Hardfork | string,
  preMergeHf: Hardfork | string
): string | Hardfork {
  return hardfork !== Hardfork.Paris ? hardfork : preMergeHf
}

/**
 * @ignore
 */
export async function runTx(this: VM, opts: RunTxOpts): Promise<RunTxResult> {
  if (this._opts.profilerOpts?.reportAfterTx === true) {
    enableProfiler = true
  }

  if (enableProfiler) {
    const title = `Profiler run - Tx ${bytesToHex(opts.tx.hash())}`
    // eslint-disable-next-line no-console
    console.log(title)
    // eslint-disable-next-line no-console
    console.time(initLabel)
    // eslint-disable-next-line no-console
    console.time(entireTxLabel)
  }

  // create a reasonable default if no block is given
  opts.block = opts.block ?? Block.fromBlockData({}, { common: this.common })

  if (opts.skipHardForkValidation !== true) {
    // Find and set preMerge hf for easy access later
    const hfs = this.common.hardforks()
    const preMergeIndex = hfs.findIndex((hf) => hf.ttd !== null && hf.ttd !== undefined) - 1
    // If no pre merge hf found, set it to first hf even if its merge
    const preMergeHf = preMergeIndex >= 0 ? hfs[preMergeIndex].name : hfs[0].name

    // If block and tx don't have a same hardfork, set tx hardfork to block
    if (
      execHardfork(opts.tx.common.hardfork(), preMergeHf) !==
      execHardfork(opts.block.common.hardfork(), preMergeHf)
    ) {
      opts.tx.common.setHardfork(opts.block.common.hardfork())
    }
    if (
      execHardfork(opts.block.common.hardfork(), preMergeHf) !==
      execHardfork(this.common.hardfork(), preMergeHf)
    ) {
      // Block and VM's hardfork should match as well
      const msg = _errorMsg('block has a different hardfork than the vm', this, opts.block, opts.tx)
      throw new Error(msg)
    }
  }

  if (opts.skipBlockGasLimitValidation !== true && opts.block.header.gasLimit < opts.tx.gasLimit) {
    const msg = _errorMsg('tx has a higher gas limit than the block', this, opts.block, opts.tx)
    throw new Error(msg)
  }

  // Ensure we start with a clear warmed accounts Map
  await this.evm.journal.cleanup()

  if (opts.reportAccessList === true) {
    this.evm.journal.startReportingAccessList()
  }

  if (opts.reportPreimages === true) {
    this.evm.journal.startReportingPreimages!()
  }

  await this.evm.journal.checkpoint()
  if (this.DEBUG) {
    debug('-'.repeat(100))
    debug(`tx checkpoint`)
  }

  // Typed transaction specific setup tasks
  if (opts.tx.supports(Capability.EIP2718TypedTransaction) && this.common.isActivatedEIP(2718)) {
    // Is it an Access List transaction?
    if (!this.common.isActivatedEIP(2930)) {
      await this.evm.journal.revert()
      const msg = _errorMsg(
        'Cannot run transaction: EIP 2930 is not activated.',
        this,
        opts.block,
        opts.tx
      )
      throw new Error(msg)
    }
    if (opts.tx.supports(Capability.EIP1559FeeMarket) && !this.common.isActivatedEIP(1559)) {
      await this.evm.journal.revert()
      const msg = _errorMsg(
        'Cannot run transaction: EIP 1559 is not activated.',
        this,
        opts.block,
        opts.tx
      )
      throw new Error(msg)
    }

    const castedTx = <AccessListEIP2930Transaction>opts.tx

    for (const accessListItem of castedTx.AccessListJSON) {
      this.evm.journal.addAlwaysWarmAddress(accessListItem.address, true)
      for (const storageKey of accessListItem.storageKeys) {
        this.evm.journal.addAlwaysWarmSlot(accessListItem.address, storageKey, true)
      }
    }
  }

  try {
    const result = await _runTx.bind(this)(opts)
    await this.evm.journal.commit()
    if (this.DEBUG) {
      debug(`tx checkpoint committed`)
    }
    return result
  } catch (e: any) {
    await this.evm.journal.revert()
    if (this.DEBUG) {
      debug(`tx checkpoint reverted`)
    }
    throw e
  } finally {
    if (this.common.isActivatedEIP(2929)) {
      this.evm.journal.cleanJournal()
    }
    this.evm.stateManager.originalStorageCache.clear()
    if (enableProfiler) {
      // eslint-disable-next-line no-console
      console.timeEnd(entireTxLabel)
      const logs = (<EVM>this.evm).getPerformanceLogs()
      if (logs.precompiles.length === 0 && logs.opcodes.length === 0) {
        // eslint-disable-next-line no-console
        console.log('No precompile or opcode execution.')
      }
      this.emitEVMProfile(logs.precompiles, 'Precompile performance')
      this.emitEVMProfile(logs.opcodes, 'Opcodes performance')
      ;(<EVM>this.evm).clearPerformanceLogs()
    }
  }
}

async function _runTx(this: VM, opts: RunTxOpts): Promise<RunTxResult> {
  const state = this.stateManager

  let stateAccesses
  if (this.common.isActivatedEIP(6800)) {
    if (!(this.stateManager instanceof StatelessVerkleStateManager)) {
      throw Error(`StatelessVerkleStateManager needed for execution of verkle blocks`)
    }
    stateAccesses = (this.stateManager as StatelessVerkleStateManager).accessWitness
  }
  const txAccesses = stateAccesses?.shallowCopy()

  const { tx, block } = opts

  if (!block) {
    throw new Error('block required')
  }

  /**
   * The `beforeTx` event
   *
   * @event Event: beforeTx
   * @type {Object}
   * @property {Transaction} tx emits the Transaction that is about to be processed
   */
  await this._emit('beforeTx', tx)

  const caller = tx.getSenderAddress()
  if (this.DEBUG) {
    debug(
      `New tx run hash=${
        opts.tx.isSigned() ? bytesToHex(opts.tx.hash()) : 'unsigned'
      } sender=${caller}`
    )
  }

  if (this.common.isActivatedEIP(2929)) {
    // Add origin and precompiles to warm addresses
    const activePrecompiles = this.evm.precompiles
    for (const [addressStr] of activePrecompiles.entries()) {
      this.evm.journal.addAlwaysWarmAddress(addressStr)
    }
    this.evm.journal.addAlwaysWarmAddress(caller.toString())
    if (tx.to !== undefined) {
      // Note: in case we create a contract, we do this in EVMs `_executeCreate` (this is also correct in inner calls, per the EIP)
      this.evm.journal.addAlwaysWarmAddress(bytesToUnprefixedHex(tx.to.bytes))
    }
    if (this.common.isActivatedEIP(3651)) {
      this.evm.journal.addAlwaysWarmAddress(bytesToUnprefixedHex(block.header.coinbase.bytes))
    }
  }

  // Validate gas limit against tx base fee (DataFee + TxFee + Creation Fee)
  const txBaseFee = tx.getBaseFee()
  let gasLimit = tx.gasLimit
  if (gasLimit < txBaseFee) {
    const msg = _errorMsg(
      `tx gas limit ${Number(gasLimit)} is lower than the minimum gas limit of ${Number(
        txBaseFee
      )}`,
      this,
      block,
      tx
    )
    throw new Error(msg)
  }
  gasLimit -= txBaseFee
  if (this.DEBUG) {
    debugGas(`Subtracting base fee (${txBaseFee}) from gasLimit (-> ${gasLimit})`)
  }

  if (this.common.isActivatedEIP(1559)) {
    // EIP-1559 spec:
    // Ensure that the user was willing to at least pay the base fee
    // assert transaction.max_fee_per_gas >= block.base_fee_per_gas
    const maxFeePerGas = 'maxFeePerGas' in tx ? tx.maxFeePerGas : tx.gasPrice
    const baseFeePerGas = block.header.baseFeePerGas!
    if (maxFeePerGas < baseFeePerGas) {
      const msg = _errorMsg(
        `Transaction's ${
          'maxFeePerGas' in tx ? 'maxFeePerGas' : 'gasPrice'
        } (${maxFeePerGas}) is less than the block's baseFeePerGas (${baseFeePerGas})`,
        this,
        block,
        tx
      )
      throw new Error(msg)
    }
  }
  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(initLabel)
    // eslint-disable-next-line no-console
    console.time(balanceNonceLabel)
  }

  // Check from account's balance and nonce
  let fromAccount = await state.getAccount(caller)
  if (fromAccount === undefined) {
    fromAccount = new Account()
  }
  const { nonce, balance } = fromAccount
  if (this.DEBUG) {
    debug(`Sender's pre-tx balance is ${balance}`)
  }
  // EIP-3607: Reject transactions from senders with deployed code
  if (this.common.isActivatedEIP(3607) && !equalsBytes(fromAccount.codeHash, KECCAK256_NULL)) {
    const msg = _errorMsg('invalid sender address, address is not EOA (EIP-3607)', this, block, tx)
    throw new Error(msg)
  }

  // Check balance against upfront tx cost
  const upFrontCost = tx.getUpfrontCost(block.header.baseFeePerGas)
  if (balance < upFrontCost) {
    if (opts.skipBalance === true && fromAccount.balance < upFrontCost) {
      if (tx.supports(Capability.EIP1559FeeMarket) === false) {
        // if skipBalance and not EIP1559 transaction, ensure caller balance is enough to run transaction
        fromAccount.balance = upFrontCost
        await this.evm.journal.putAccount(caller, fromAccount)
      }
    } else {
      const msg = _errorMsg(
        `sender doesn't have enough funds to send tx. The upfront cost is: ${upFrontCost} and the sender's account (${caller}) only has: ${balance}`,
        this,
        block,
        tx
      )
      throw new Error(msg)
    }
  }

  // Check balance against max potential cost (for EIP 1559 and 4844)
  let maxCost = tx.value
  let blobGasPrice = BIGINT_0
  let totalblobGas = BIGINT_0
  if (tx.supports(Capability.EIP1559FeeMarket)) {
    // EIP-1559 spec:
    // The signer must be able to afford the transaction
    // `assert balance >= gas_limit * max_fee_per_gas`
    maxCost += tx.gasLimit * (tx as FeeMarketEIP1559Transaction).maxFeePerGas
  }

  if (tx instanceof BlobEIP4844Transaction) {
    if (!this.common.isActivatedEIP(4844)) {
      const msg = _errorMsg('blob transactions are only valid with EIP4844 active', this, block, tx)
      throw new Error(msg)
    }
    // EIP-4844 spec
    // the signer must be able to afford the transaction
    // assert signer(tx).balance >= tx.message.gas * tx.message.max_fee_per_gas + get_total_data_gas(tx) * tx.message.max_fee_per_data_gas
    const castTx = tx as BlobEIP4844Transaction
    totalblobGas = castTx.common.param('gasConfig', 'blobGasPerBlob') * BigInt(castTx.numBlobs())
    maxCost += totalblobGas * castTx.maxFeePerBlobGas

    // 4844 minimum blobGas price check
    if (opts.block === undefined) {
      const msg = _errorMsg(
        `Block option must be supplied to compute blob gas price`,
        this,
        block,
        tx
      )
      throw new Error(msg)
    }
    blobGasPrice = opts.block.header.getBlobGasPrice()
    if (castTx.maxFeePerBlobGas < blobGasPrice) {
      const msg = _errorMsg(
        `Transaction's maxFeePerBlobGas ${castTx.maxFeePerBlobGas}) is less than block blobGasPrice (${blobGasPrice}).`,
        this,
        block,
        tx
      )
      throw new Error(msg)
    }
  }

  if (fromAccount.balance < maxCost) {
    if (opts.skipBalance === true && fromAccount.balance < maxCost) {
      // if skipBalance, ensure caller balance is enough to run transaction
      fromAccount.balance = maxCost
      await this.evm.journal.putAccount(caller, fromAccount)
    } else {
      const msg = _errorMsg(
        `sender doesn't have enough funds to send tx. The max cost is: ${maxCost} and the sender's account (${caller}) only has: ${balance}`,
        this,
        block,
        tx
      )
      throw new Error(msg)
    }
  }

  if (opts.skipNonce !== true) {
    if (nonce !== tx.nonce) {
      const msg = _errorMsg(
        `the tx doesn't have the correct nonce. account has nonce of: ${nonce} tx has nonce of: ${tx.nonce}`,
        this,
        block,
        tx
      )
      throw new Error(msg)
    }
  }

  let gasPrice: bigint
  let inclusionFeePerGas: bigint
  // EIP-1559 tx
  if (tx.supports(Capability.EIP1559FeeMarket)) {
    // TODO make txs use the new getEffectivePriorityFee
    const baseFee = block.header.baseFeePerGas!
    inclusionFeePerGas = tx.getEffectivePriorityFee(baseFee)

    gasPrice = inclusionFeePerGas + baseFee
  } else {
    // Have to cast as legacy tx since EIP1559 tx does not have gas price
    gasPrice = (<LegacyTransaction>tx).gasPrice
    if (this.common.isActivatedEIP(1559)) {
      const baseFee = block.header.baseFeePerGas!
      inclusionFeePerGas = (<LegacyTransaction>tx).gasPrice - baseFee
    }
  }

  // EIP-4844 tx
  let blobVersionedHashes
  if (tx instanceof BlobEIP4844Transaction) {
    blobVersionedHashes = (tx as BlobEIP4844Transaction).blobVersionedHashes
  }

  // Update from account's balance
  const txCost = tx.gasLimit * gasPrice
  const blobGasCost = totalblobGas * blobGasPrice
  fromAccount.balance -= txCost
  fromAccount.balance -= blobGasCost
  if (opts.skipBalance === true && fromAccount.balance < BIGINT_0) {
    fromAccount.balance = BIGINT_0
  }
  await this.evm.journal.putAccount(caller, fromAccount)

  const writtenAddresses = new Set<string>()
  if (tx.supports(Capability.EIP7702EOACode)) {
    // Add contract code for authroity tuples provided by EIP 7702 tx
    const authorizationList = (<EIP7702CompatibleTx>tx).authorizationList
    const MAGIC = new Uint8Array([5])
    for (let i = 0; i < authorizationList.length; i++) {
      // Authority tuple validation
      const data = authorizationList[i]
      const chainId = data[0]
      const chainIdBN = bytesToBigInt(chainId)
      if (chainIdBN !== BIGINT_0 && chainIdBN !== this.common.chainId()) {
        // Chain id does not match, continue
        continue
      }
      // Address to take code from
      const address = data[1]
      const nonceList = data[2]
      const yParity = bytesToBigInt(data[3])
      const r = data[4]
      const s = data[5]

      const rlpdSignedMessage = RLP.encode([chainId, address, nonceList])
      const toSign = keccak256(concatBytes(MAGIC, rlpdSignedMessage))
      const pubKey = ecrecover(toSign, yParity, r, s)
      // Address to set code to
      const authority = new Address(publicToAddress(pubKey))
      const account = (await this.stateManager.getAccount(authority)) ?? new Account()

      if (account.isContract()) {
        // Note: this also checks if the code has already been set once by a previous tuple
        // So, if there are multiply entires for the same address, then this is fine
        continue
      }
      if (nonceList.length !== 0 && account.nonce !== bytesToBigInt(nonceList[0])) {
        continue
      }

      const addressConverted = new Address(address)
      const addressCode = await this.stateManager.getContractCode(addressConverted)
      await this.stateManager.putContractCode(authority, addressCode)

      writtenAddresses.add(authority.toString())
      this.evm.journal.addAlwaysWarmAddress(authority.toString())
    }
  }

  if (this.DEBUG) {
    debug(`Update fromAccount (caller) balance (-> ${fromAccount.balance}))`)
  }
  let executionTimerPrecise: number
  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(balanceNonceLabel)
    executionTimerPrecise = performance.now()
  }

  /*
   * Execute message
   */
  const { value, data, to } = tx

  if (this.DEBUG) {
    debug(
      `Running tx=${
        tx.isSigned() ? bytesToHex(tx.hash()) : 'unsigned'
      } with caller=${caller} gasLimit=${gasLimit} to=${
        to?.toString() ?? 'none'
      } value=${value} data=${short(data)}`
    )
  }

  const results = (await this.evm.runCall({
    block,
    gasPrice,
    caller,
    gasLimit,
    to,
    value,
    data,
    blobVersionedHashes,
    accessWitness: txAccesses,
  })) as RunTxResult

  if (this.common.isActivatedEIP(6800)) {
    stateAccesses?.merge(txAccesses!)
  }

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.log(`${executionLabel}: ${performance.now() - executionTimerPrecise!}ms`)
    // eslint-disable-next-line no-console
    console.log('[ For execution details see table output ]')
    // eslint-disable-next-line no-console
    console.time(logsGasBalanceLabel)
  }

  if (this.DEBUG) {
    debug(`Update fromAccount (caller) nonce (-> ${fromAccount.nonce})`)
  }

  if (this.DEBUG) {
    const { executionGasUsed, exceptionError, returnValue } = results.execResult
    debug('-'.repeat(100))
    debug(
      `Received tx execResult: [ executionGasUsed=${executionGasUsed} exceptionError=${
        exceptionError !== undefined ? `'${exceptionError.error}'` : 'none'
      } returnValue=${short(returnValue)} gasRefund=${results.gasRefund ?? 0} ]`
    )
  }

  /*
   * Parse results
   */
  // Generate the bloom for the tx
  results.bloom = txLogsBloom(results.execResult.logs, this.common)
  if (this.DEBUG) {
    debug(`Generated tx bloom with logs=${results.execResult.logs?.length}`)
  }

  // Calculate the total gas used
  results.totalGasSpent = results.execResult.executionGasUsed + txBaseFee
  if (this.DEBUG) {
    debugGas(`tx add baseFee ${txBaseFee} to totalGasSpent (-> ${results.totalGasSpent})`)
  }

  // Add blob gas used to result
  if (isBlobEIP4844Tx(tx)) {
    results.blobGasUsed = totalblobGas
  }

  // Process any gas refund
  let gasRefund = results.execResult.gasRefund ?? BIGINT_0
  results.gasRefund = gasRefund
  const maxRefundQuotient = this.common.param('gasConfig', 'maxRefundQuotient')
  if (gasRefund !== BIGINT_0) {
    const maxRefund = results.totalGasSpent / maxRefundQuotient
    gasRefund = gasRefund < maxRefund ? gasRefund : maxRefund
    results.totalGasSpent -= gasRefund
    if (this.DEBUG) {
      debug(`Subtract tx gasRefund (${gasRefund}) from totalGasSpent (-> ${results.totalGasSpent})`)
    }
  } else {
    if (this.DEBUG) {
      debug(`No tx gasRefund`)
    }
  }
  results.amountSpent = results.totalGasSpent * gasPrice

  // Update sender's balance
  fromAccount = await state.getAccount(caller)
  if (fromAccount === undefined) {
    fromAccount = new Account()
  }
  const actualTxCost = results.totalGasSpent * gasPrice
  const txCostDiff = txCost - actualTxCost
  fromAccount.balance += txCostDiff
  await this.evm.journal.putAccount(caller, fromAccount)
  if (this.DEBUG) {
    debug(
      `Refunded txCostDiff (${txCostDiff}) to fromAccount (caller) balance (-> ${fromAccount.balance})`
    )
  }

  // Update miner's balance
  let miner
  if (this.common.consensusType() === ConsensusType.ProofOfAuthority) {
    miner = block.header.cliqueSigner()
  } else {
    miner = block.header.coinbase
  }

  let minerAccount = await state.getAccount(miner)
  if (minerAccount === undefined) {
    if (this.common.isActivatedEIP(6800)) {
      ;(state as StatelessVerkleStateManager).accessWitness!.touchAndChargeProofOfAbsence(miner)
    }
    minerAccount = new Account()
  }
  // add the amount spent on gas to the miner's account
  results.minerValue = this.common.isActivatedEIP(1559)
    ? results.totalGasSpent * inclusionFeePerGas!
    : results.amountSpent
  minerAccount.balance += results.minerValue

  if (this.common.isActivatedEIP(6800)) {
    // use this utility to build access but the computed gas is not charged and hence free
    ;(state as StatelessVerkleStateManager).accessWitness!.touchTxTargetAndComputeGas(miner, {
      sendsValue: true,
    })
  }

  // Put the miner account into the state. If the balance of the miner account remains zero, note that
  // the state.putAccount function puts this into the "touched" accounts. This will thus be removed when
  // we clean the touched accounts below in case we are in a fork >= SpuriousDragon
  await this.evm.journal.putAccount(miner, minerAccount)
  if (this.DEBUG) {
    debug(`tx update miner account (${miner}) balance (-> ${minerAccount.balance})`)
  }

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(logsGasBalanceLabel)
    // eslint-disable-next-line no-console
    console.time(accountsCleanUpLabel)
  }

  /*
   * Cleanup accounts
   */
  if (results.execResult.selfdestruct !== undefined) {
    for (const addressToSelfdestructHex of results.execResult.selfdestruct) {
      const address = new Address(hexToBytes(addressToSelfdestructHex))
      if (this.common.isActivatedEIP(6780)) {
        // skip cleanup of addresses not in createdAddresses
        if (!results.execResult.createdAddresses!.has(address.toString())) {
          continue
        }
      }
      await this.evm.journal.deleteAccount(address)
      if (this.DEBUG) {
        debug(`tx selfdestruct on address=${address}`)
      }
    }
  }

  /**
   * Cleanup code of accounts written to in a 7702 transaction
   */

  for (const str of writtenAddresses) {
    const address = Address.fromString(str)
    await this.stateManager.putContractCode(address, new Uint8Array())
  }

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(accountsCleanUpLabel)
    // eslint-disable-next-line no-console
    console.time(accessListLabel)
  }

  if (opts.reportAccessList === true && this.common.isActivatedEIP(2930)) {
    // Convert the Map to the desired type
    const accessList: AccessList = []
    for (const [address, set] of this.evm.journal.accessList!) {
      const item: AccessListItem = {
        address: `0x${address}`,
        storageKeys: [],
      }
      for (const slot of set) {
        item.storageKeys.push(`0x${slot}`)
      }
      accessList.push(item)
    }

    results.accessList = accessList
  }

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(accessListLabel)
    // eslint-disable-next-line no-console
    console.time(journalCacheCleanUpLabel)
  }

  if (opts.reportPreimages === true && this.evm.journal.preimages !== undefined) {
    results.preimages = this.evm.journal.preimages
  }

  await this.evm.journal.cleanup()
  state.originalStorageCache.clear()

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(journalCacheCleanUpLabel)
    // eslint-disable-next-line no-console
    console.time(receiptsLabel)
  }

  // Generate the tx receipt
  const gasUsed = opts.blockGasUsed !== undefined ? opts.blockGasUsed : block.header.gasUsed
  const cumulativeGasUsed = gasUsed + results.totalGasSpent
  results.receipt = await generateTxReceipt.bind(this)(
    tx,
    results,
    cumulativeGasUsed,
    totalblobGas,
    blobGasPrice
  )

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(receiptsLabel)
  }

  /**
   * The `afterTx` event
   *
   * @event Event: afterTx
   * @type {Object}
   * @property {Object} result result of the transaction
   */
  const event: AfterTxEvent = { transaction: tx, ...results }
  await this._emit('afterTx', event)
  if (this.DEBUG) {
    debug(
      `tx run finished hash=${
        opts.tx.isSigned() ? bytesToHex(opts.tx.hash()) : 'unsigned'
      } sender=${caller}`
    )
  }

  return results
}

/**
 * @method txLogsBloom
 * @private
 */
function txLogsBloom(logs?: any[], common?: Common): Bloom {
  const bloom = new Bloom(undefined, common)
  if (logs) {
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]
      // add the address
      bloom.add(log[0])
      // add the topics
      const topics = log[1]
      for (let q = 0; q < topics.length; q++) {
        bloom.add(topics[q])
      }
    }
  }
  return bloom
}

/**
 * Returns the tx receipt.
 * @param this The vm instance
 * @param tx The transaction
 * @param txResult The tx result
 * @param cumulativeGasUsed The gas used in the block including this tx
 * @param blobGasUsed The blob gas used in the tx
 * @param blobGasPrice The blob gas price for the block including this tx
 */
export async function generateTxReceipt(
  this: VM,
  tx: TypedTransaction,
  txResult: RunTxResult,
  cumulativeGasUsed: bigint,
  blobGasUsed?: bigint,
  blobGasPrice?: bigint
): Promise<TxReceipt> {
  const baseReceipt: BaseTxReceipt = {
    cumulativeBlockGasUsed: cumulativeGasUsed,
    bitvector: txResult.bloom.bitvector,
    logs: txResult.execResult.logs ?? [],
  }

  let receipt
  if (this.DEBUG) {
    debug(
      `Generate tx receipt transactionType=${
        tx.type
      } cumulativeBlockGasUsed=${cumulativeGasUsed} bitvector=${short(baseReceipt.bitvector)} (${
        baseReceipt.bitvector.length
      } bytes) logs=${baseReceipt.logs.length}`
    )
  }

  if (!tx.supports(Capability.EIP2718TypedTransaction)) {
    // Legacy transaction
    if (this.common.gteHardfork(Hardfork.Byzantium)) {
      // Post-Byzantium
      receipt = {
        status: txResult.execResult.exceptionError !== undefined ? 0 : 1, // Receipts have a 0 as status on error
        ...baseReceipt,
      } as PostByzantiumTxReceipt
    } else {
      // Pre-Byzantium
      const stateRoot = await this.stateManager.getStateRoot()
      receipt = {
        stateRoot,
        ...baseReceipt,
      } as PreByzantiumTxReceipt
    }
  } else {
    // Typed EIP-2718 Transaction
    if (isBlobEIP4844Tx(tx)) {
      receipt = {
        blobGasUsed,
        blobGasPrice,
        status: txResult.execResult.exceptionError ? 0 : 1,
        ...baseReceipt,
      } as EIP4844BlobTxReceipt
    } else {
      receipt = {
        status: txResult.execResult.exceptionError ? 0 : 1,
        ...baseReceipt,
      } as PostByzantiumTxReceipt
    }
  }
  return receipt
}

/**
 * Internal helper function to create an annotated error message
 *
 * @param msg Base error message
 * @hidden
 */
function _errorMsg(msg: string, vm: VM, block: Block, tx: TypedTransaction) {
  const blockErrorStr = 'errorStr' in block ? block.errorStr() : 'block'
  const txErrorStr = 'errorStr' in tx ? tx.errorStr() : 'tx'

  const errorMsg = `${msg} (${vm.errorStr()} -> ${blockErrorStr} -> ${txErrorStr})`
  return errorMsg
}

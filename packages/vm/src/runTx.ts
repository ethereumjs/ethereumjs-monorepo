import { cliqueSigner, createBlockHeader } from '@ethereumjs/block'
import { ConsensusType, Hardfork } from '@ethereumjs/common'
import { BinaryTreeAccessWitness, type EVM } from '@ethereumjs/evm'
import { Capability, isBlob4844Tx } from '@ethereumjs/tx'
import {
  Account,
  Address,
  BIGINT_0,
  BIGINT_1,
  EthereumJSErrorWithoutCode,
  KECCAK256_NULL,
  MAX_UINT64,
  type PrefixedHexString,
  SECP256K1_ORDER_DIV_2,
  bigIntMax,
  bytesToBigInt,
  bytesToHex,
  bytesToUnprefixedHex,
  concatBytes,
  eoaCode7702RecoverAuthority,
  equalsBytes,
  hexToBytes,
  short,
} from '@ethereumjs/util'
import debugDefault from 'debug'

import { Bloom } from './bloom/index.ts'
import { emitEVMProfile } from './emitEVMProfile.ts'

import type { Block } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import type {
  AccessList,
  AccessList2930Tx,
  AccessListItem,
  EIP7702CompatibleTx,
  FeeMarket1559Tx,
  LegacyTx,
  TypedTransaction,
} from '@ethereumjs/tx'
import type {
  AfterTxEvent,
  BaseTxReceipt,
  EIP4844BlobTxReceipt,
  PostByzantiumTxReceipt,
  PreByzantiumTxReceipt,
  RunTxOpts,
  RunTxResult,
  TxReceipt,
} from './types.ts'
import type { VM } from './vm.ts'

const debug = debugDefault('vm:tx')
const debugGas = debugDefault('vm:tx:gas')

const DEFAULT_HEADER = createBlockHeader()

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

// EIP-7702 flag: if contract code starts with these 3 bytes, it is a 7702-delegated EOA
const DELEGATION_7702_FLAG = new Uint8Array([0xef, 0x01, 0x00])

/**
 * Process EIP-7702 authorization list tuples.
 * Sets delegation code for authorized accounts and calculates gas refunds.
 *
 * @param vm - The VM instance
 * @param tx - The transaction (must support EIP7702EOACode capability)
 * @param caller - The transaction sender address
 * @param initialGasRefund - The current gas refund amount
 * @returns The updated gas refund amount
 */
async function processAuthorizationList(
  vm: VM,
  tx: EIP7702CompatibleTx,
  caller: Address,
  initialGasRefund: bigint,
): Promise<bigint> {
  let gasRefund = initialGasRefund
  const authorizationList = tx.authorizationList

  for (let i = 0; i < authorizationList.length; i++) {
    const data = authorizationList[i]

    // Validate chain ID
    const chainId = data[0]
    const chainIdBN = bytesToBigInt(chainId)
    if (chainIdBN !== BIGINT_0 && chainIdBN !== vm.common.chainId()) {
      continue
    }

    // Validate nonce bounds
    const authorityNonce = data[2]
    if (bytesToBigInt(authorityNonce) >= MAX_UINT64) {
      // Authority nonce >= 2^64 - 1. Bumping this nonce by one will not make this fit in an uint64.
      // EIPs PR: https://github.com/ethereum/EIPs/pull/8938
      continue
    }

    // Validate signature malleability (s value)
    const s = data[5]
    if (bytesToBigInt(s) > SECP256K1_ORDER_DIV_2) {
      // Malleability protection to avoid "flipping" a valid signature
      continue
    }

    // Validate yParity
    const yParity = bytesToBigInt(data[3])
    if (yParity > BIGINT_1) {
      continue
    }

    // Recover authority address from signature
    let authority: Address
    try {
      authority = eoaCode7702RecoverAuthority(data)
    } catch {
      // Invalid signature
      continue
    }

    const accountMaybeUndefined = await vm.stateManager.getAccount(authority)
    const accountExists = accountMaybeUndefined !== undefined
    const account = accountMaybeUndefined ?? new Account()

    // Add authority address to warm addresses
    vm.evm.journal.addAlwaysWarmAddress(authority.toString())

    // EIP-7928: Add authority address to BAL (even if authorization fails later,
    // the account was accessed to check nonce/code)
    if (vm.common.isActivatedEIP(7928)) {
      vm.evm.blockLevelAccessList!.addAddress(authority.toString())
    }

    // Skip if account is a "normal" contract (not 7702-delegated)
    if (account.isContract()) {
      const code = await vm.stateManager.getCode(authority)
      if (!equalsBytes(code.slice(0, 3), DELEGATION_7702_FLAG)) {
        continue
      }
    }

    // Nonce validation
    if (caller.toString() === authority.toString()) {
      // Edge case: caller is the authority (self-signing delegation)
      // Virtually bump the account nonce by one for comparison
      if (account.nonce + BIGINT_1 !== bytesToBigInt(authorityNonce)) {
        continue
      }
    } else if (account.nonce !== bytesToBigInt(authorityNonce)) {
      continue
    }

    // Calculate gas refund for existing accounts
    if (accountExists) {
      const refund = tx.common.param('perEmptyAccountCost') - tx.common.param('perAuthBaseGas')
      gasRefund += refund
    }

    // Update account nonce and store
    account.nonce++
    await vm.evm.journal.putAccount(authority, account)
    if (vm.common.isActivatedEIP(7928)) {
      vm.evm.blockLevelAccessList!.addNonceChange(
        authority.toString(),
        account.nonce,
        vm.evm.blockLevelAccessList!.blockAccessIndex,
      )
    }

    // Set delegation code
    const address = data[1]
    // Get current code before modifying (needed for BAL tracking)
    const currentCode = vm.common.isActivatedEIP(7928)
      ? await vm.stateManager.getCode(authority)
      : undefined
    if (equalsBytes(address, new Uint8Array(20))) {
      // Special case: clear delegation when delegating to zero address
      // See EIP PR: https://github.com/ethereum/EIPs/pull/8929
      await vm.stateManager.putCode(authority, new Uint8Array())
      if (vm.common.isActivatedEIP(7928)) {
        vm.evm.blockLevelAccessList!.addCodeChange(
          authority.toString(),
          new Uint8Array(),
          vm.evm.blockLevelAccessList!.blockAccessIndex,
          currentCode,
        )
      }
    } else {
      const addressCode = concatBytes(DELEGATION_7702_FLAG, address)
      await vm.stateManager.putCode(authority, addressCode)
      if (vm.common.isActivatedEIP(7928)) {
        vm.evm.blockLevelAccessList!.addCodeChange(
          authority.toString(),
          addressCode,
          vm.evm.blockLevelAccessList!.blockAccessIndex,
          currentCode,
        )
      }
    }
  }

  return gasRefund
}

/**
 * Process selfdestruct cleanup for accounts marked for destruction.
 * Handles EIP-6780 restrictions (only delete contracts created in same tx).
 *
 * @param vm - The VM instance
 * @param results - The execution results containing selfdestruct list
 */
async function processSelfdestructs(vm: VM, results: RunTxResult): Promise<void> {
  if (results.execResult.selfdestruct === undefined) {
    return
  }

  const destroyedForBAL: Set<PrefixedHexString> = new Set()
  for (const addressToSelfdestructHex of results.execResult.selfdestruct) {
    const address = new Address(hexToBytes(addressToSelfdestructHex))

    // EIP-6780: Only delete contracts created in the same transaction
    if (vm.common.isActivatedEIP(6780)) {
      if (!results.execResult.createdAddresses!.has(address.toString())) {
        continue
      }
    }

    await vm.evm.journal.deleteAccount(address)
    destroyedForBAL.add(address.toString())
    if (vm.DEBUG) {
      debug(`tx selfdestruct on address=${address}`)
    }
  }

  if (destroyedForBAL.size > 0 && vm.common.isActivatedEIP(7928)) {
    vm.evm.blockLevelAccessList!.cleanupSelfdestructed([...destroyedForBAL])
  }
}

/**
 * Build the access list result from the journal's tracked accesses.
 * Converts the internal Map format to the standard AccessList format.
 *
 * @param vm - The VM instance
 * @returns The formatted access list
 */
function buildAccessListResult(vm: VM): AccessList {
  const accessList: AccessList = []

  for (const [address, storageSet] of vm.evm.journal.accessList!) {
    const item: AccessListItem = {
      address: `0x${address}`,
      storageKeys: [],
    }
    for (const slot of storageSet) {
      item.storageKeys.push(`0x${slot}`)
    }
    accessList.push(item)
  }

  return accessList
}

/**
 * Update the miner's account balance with the transaction fee.
 * Handles both EIP-1559 (priority fee only) and legacy (full gas price) fee models.
 *
 * @param vm - The VM instance
 * @param state - The state manager
 * @param block - The block (optional)
 * @param results - The transaction results to update with minerValue
 * @param inclusionFeePerGas - The priority fee per gas (for EIP-1559)
 */
async function updateMinerBalance(
  vm: VM,
  state: VM['stateManager'],
  block: Block | undefined,
  results: RunTxResult,
  inclusionFeePerGas: bigint,
): Promise<void> {
  // Determine miner address based on consensus type
  let miner: Address
  if (vm.common.consensusType() === ConsensusType.ProofOfAuthority) {
    miner = cliqueSigner(block?.header ?? DEFAULT_HEADER)
  } else {
    miner = block?.header.coinbase ?? DEFAULT_HEADER.coinbase
  }

  // Get or create miner account
  let minerAccount = await state.getAccount(miner)
  if (minerAccount === undefined) {
    minerAccount = new Account()
  }

  // Calculate miner value: priority fee for EIP-1559, full amount for legacy
  results.minerValue = vm.common.isActivatedEIP(1559)
    ? results.totalGasSpent * inclusionFeePerGas
    : results.amountSpent
  const minerOriginalBalance = minerAccount.balance
  minerAccount.balance += results.minerValue
  if (vm.common.isActivatedEIP(7928)) {
    if (results.minerValue !== BIGINT_0) {
      vm.evm.blockLevelAccessList!.addBalanceChange(
        miner.toString(),
        minerAccount.balance,
        vm.evm.blockLevelAccessList!.blockAccessIndex,
        minerOriginalBalance,
      )
    } else {
      // EIP-7928: If the COINBASE reward is zero, the COINBASE address
      // MUST be included as a read (address only, no balance change)
      vm.evm.blockLevelAccessList!.addAddress(miner.toString())
    }
  }

  // Store updated miner account
  // Note: If balance remains zero, account is marked as "touched" and may be
  // removed during cleanup for forks >= SpuriousDragon
  await vm.evm.journal.putAccount(miner, minerAccount)

  if (vm.DEBUG) {
    debug(`tx update miner account (${miner}) balance (-> ${minerAccount.balance})`)
  }
}

/**
 * @ignore
 */
export async function runTx(vm: VM, opts: RunTxOpts): Promise<RunTxResult> {
  if (vm['_opts'].profilerOpts?.reportAfterTx === true) {
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

  if (opts.skipHardForkValidation !== true && opts.block !== undefined) {
    // If block and tx don't have a same hardfork, set tx hardfork to block
    if (opts.tx.common.hardfork() !== opts.block.common.hardfork()) {
      opts.tx.common.setHardfork(opts.block.common.hardfork())
    }
    if (opts.block.common.hardfork() !== vm.common.hardfork()) {
      // Block and VM's hardfork should match as well
      const msg = _errorMsg('block has a different hardfork than the vm', vm, opts.block, opts.tx)
      throw EthereumJSErrorWithoutCode(msg)
    }
  }

  const gasLimit = opts.block?.header.gasLimit ?? DEFAULT_HEADER.gasLimit
  if (opts.skipBlockGasLimitValidation !== true && gasLimit < opts.tx.gasLimit) {
    const msg = _errorMsg('tx has a higher gas limit than the block', vm, opts.block, opts.tx)
    throw EthereumJSErrorWithoutCode(msg)
  }

  // Ensure we start with a clear warmed accounts Map
  await vm.evm.journal.cleanup()

  if (opts.reportAccessList === true) {
    vm.evm.journal.startReportingAccessList()
  }

  if (opts.reportPreimages === true) {
    vm.evm.journal.startReportingPreimages!()
  }

  await vm.evm.journal.checkpoint()
  if (vm.DEBUG) {
    debug('-'.repeat(100))
    debug(`tx checkpoint`)
  }

  // Typed transaction specific setup tasks
  if (opts.tx.supports(Capability.EIP2718TypedTransaction) && vm.common.isActivatedEIP(2718)) {
    // Is it an Access List transaction?
    if (!vm.common.isActivatedEIP(2930)) {
      await vm.evm.journal.revert()
      const msg = _errorMsg(
        'Cannot run transaction: EIP 2930 is not activated.',
        vm,
        opts.block,
        opts.tx,
      )
      throw EthereumJSErrorWithoutCode(msg)
    }
    if (opts.tx.supports(Capability.EIP1559FeeMarket) && !vm.common.isActivatedEIP(1559)) {
      await vm.evm.journal.revert()
      const msg = _errorMsg(
        'Cannot run transaction: EIP 1559 is not activated.',
        vm,
        opts.block,
        opts.tx,
      )
      throw EthereumJSErrorWithoutCode(msg)
    }

    const castedTx = opts.tx as AccessList2930Tx

    for (const accessListItem of castedTx.accessList) {
      const [addressBytes, slotBytesList] = accessListItem
      // Using deprecated bytesToUnprefixedHex for performance: journal methods expect unprefixed hex strings for Map/Set lookups.
      const address = bytesToUnprefixedHex(addressBytes)
      vm.evm.journal.addAlwaysWarmAddress(address, true)
      for (const storageKey of slotBytesList) {
        vm.evm.journal.addAlwaysWarmSlot(address, bytesToUnprefixedHex(storageKey), true)
      }
    }
  }

  try {
    const result = await _runTx(vm, opts)
    await vm.evm.journal.commit()
    if (vm.DEBUG) {
      debug(`tx checkpoint committed`)
    }
    return result
  } catch (e: any) {
    await vm.evm.journal.revert()
    if (vm.DEBUG) {
      debug(`tx checkpoint reverted`)
    }
    throw e
  } finally {
    if (vm.common.isActivatedEIP(2929)) {
      vm.evm.journal.cleanJournal()
    }
    vm.evm.stateManager.originalStorageCache.clear()
    if (enableProfiler) {
      // eslint-disable-next-line no-console
      console.timeEnd(entireTxLabel)
      const logs = (vm.evm as EVM).getPerformanceLogs()
      if (logs.precompiles.length === 0 && logs.opcodes.length === 0) {
        // eslint-disable-next-line no-console
        console.log('No precompile or opcode execution.')
      }
      emitEVMProfile(logs.precompiles, 'Precompile performance')
      emitEVMProfile(logs.opcodes, 'Opcodes performance')
      ;(vm.evm as EVM).clearPerformanceLogs()
    }
  }
}

async function _runTx(vm: VM, opts: RunTxOpts): Promise<RunTxResult> {
  const state = vm.stateManager

  // ===========================
  // SETUP: Binary Tree Witness
  // ===========================
  let stateAccesses: BinaryTreeAccessWitness | undefined
  let txAccesses: BinaryTreeAccessWitness | undefined

  if (vm.common.isActivatedEIP(7864)) {
    if (vm.evm.binaryTreeAccessWitness === undefined) {
      throw Error(`Binary tree access witness needed for execution of binary tree blocks`)
    }

    // Check if statemanager is a BinaryTreeStateManager by checking for a method only on BinaryTreeStateManager API
    if (!('verifyBinaryPostState' in vm.stateManager)) {
      throw EthereumJSErrorWithoutCode(
        `Binary tree State Manager needed for execution of binary tree blocks`,
      )
    }
    stateAccesses = vm.evm.binaryTreeAccessWitness
    txAccesses = new BinaryTreeAccessWitness({
      hashFunction: vm.evm.binaryTreeAccessWitness.hashFunction,
    })
  }

  // ===========================
  // SETUP: Transaction and Events
  // ===========================
  const { tx, block } = opts

  /** The `beforeTx` event - emits the Transaction that is about to be processed */
  await vm._emit('beforeTx', tx)

  const caller = tx.getSenderAddress()
  if (vm.DEBUG) {
    debug(
      `New tx run hash=${
        opts.tx.isSigned() ? bytesToHex(opts.tx.hash()) : 'unsigned'
      } sender=${caller}`,
    )
  }

  // ===========================
  // SETUP: Address Warming (EIP-2929)
  // ===========================
  if (vm.common.isActivatedEIP(2929)) {
    // Add origin, precompiles, and relevant addresses to warm set
    const activePrecompiles = vm.evm.precompiles
    for (const [addressStr] of activePrecompiles.entries()) {
      vm.evm.journal.addAlwaysWarmAddress(addressStr)
    }
    vm.evm.journal.addAlwaysWarmAddress(caller.toString())
    if (tx.to !== undefined) {
      // Note: in case we create a contract, we do vm in EVMs `_executeCreate` (vm is also correct in inner calls, per the EIP)
      // Using deprecated bytesToUnprefixedHex for performance: journal methods expect unprefixed hex strings.
      vm.evm.journal.addAlwaysWarmAddress(bytesToUnprefixedHex(tx.to.bytes))
    }
    if (vm.common.isActivatedEIP(3651)) {
      const coinbase = block?.header.coinbase.bytes ?? DEFAULT_HEADER.coinbase.bytes
      // Using deprecated bytesToUnprefixedHex for performance: journal methods expect unprefixed hex strings.
      vm.evm.journal.addAlwaysWarmAddress(bytesToUnprefixedHex(coinbase))
    }
  }

  // ===========================
  // VALIDATION: Gas Limit and Fees
  // ===========================
  // Validate gas limit against tx base fee (DataFee + TxFee + Creation Fee)
  const intrinsicGas = tx.getIntrinsicGas()
  let floorCost = BIGINT_0

  // EIP-7623: Calculate floor cost for calldata
  if (vm.common.isActivatedEIP(7623)) {
    // Tx should at least cover the floor price for tx data
    let tokens = 0
    for (let i = 0; i < tx.data.length; i++) {
      tokens += tx.data[i] === 0 ? 1 : 4
    }
    floorCost =
      tx.common.param('txGas') + tx.common.param('totalCostFloorPerToken') * BigInt(tokens)
  }

  let gasLimit = tx.gasLimit
  const minGasLimit = bigIntMax(intrinsicGas, floorCost)
  if (gasLimit < minGasLimit) {
    const msg = _errorMsg(
      `tx gas limit ${Number(gasLimit)} is lower than the minimum gas limit of ${Number(
        minGasLimit,
      )}`,
      vm,
      block,
      tx,
    )
    throw EthereumJSErrorWithoutCode(msg)
  }
  gasLimit -= intrinsicGas
  if (vm.DEBUG) {
    debugGas(`Subtracting base fee (${intrinsicGas}) from gasLimit (-> ${gasLimit})`)
  }

  if (vm.common.isActivatedEIP(1559)) {
    // EIP-1559 spec:
    // Ensure that the user was willing to at least pay the base fee
    // assert transaction.max_fee_per_gas >= block.base_fee_per_gas
    const maxFeePerGas = 'maxFeePerGas' in tx ? tx.maxFeePerGas : tx.gasPrice
    const baseFeePerGas = block?.header.baseFeePerGas ?? DEFAULT_HEADER.baseFeePerGas!
    if (maxFeePerGas < baseFeePerGas) {
      const msg = _errorMsg(
        `Transaction's ${
          'maxFeePerGas' in tx ? 'maxFeePerGas' : 'gasPrice'
        } (${maxFeePerGas}) is less than the block's baseFeePerGas (${baseFeePerGas})`,
        vm,
        block,
        tx,
      )
      throw EthereumJSErrorWithoutCode(msg)
    }
  }
  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(initLabel)
    // eslint-disable-next-line no-console
    console.time(balanceNonceLabel)
  }

  // ===========================
  // VALIDATION: Sender Account
  // ===========================
  let fromAccount = await state.getAccount(caller)
  if (fromAccount === undefined) {
    fromAccount = new Account()
  }
  const { nonce, balance } = fromAccount
  if (vm.DEBUG) {
    debug(`Sender's pre-tx balance is ${balance}`)
  }

  // EIP-3607: Reject transactions from senders with deployed code
  if (!equalsBytes(fromAccount.codeHash, KECCAK256_NULL)) {
    const isActive7702 = vm.common.isActivatedEIP(7702)
    switch (isActive7702) {
      case true: {
        const code = await state.getCode(caller)
        // If the EOA is 7702-delegated, sending txs from this EOA is fine
        if (equalsBytes(code.slice(0, 3), DELEGATION_7702_FLAG)) break
        // Trying to send TX from account with code (which is not 7702-delegated), falls through and throws
      }
      default: {
        const msg = _errorMsg(
          'invalid sender address, address is not EOA (EIP-3607)',
          vm,
          block,
          tx,
        )
        throw EthereumJSErrorWithoutCode(msg)
      }
    }
  }

  // Check balance against upfront tx cost
  const baseFeePerGas = block?.header.baseFeePerGas ?? DEFAULT_HEADER.baseFeePerGas
  const upFrontCost = tx.getUpfrontCost(baseFeePerGas)
  if (balance < upFrontCost) {
    if (opts.skipBalance === true && fromAccount.balance < upFrontCost) {
      if (tx.supports(Capability.EIP1559FeeMarket) === false) {
        // if skipBalance and not EIP1559 transaction, ensure caller balance is enough to run transaction
        const originalBalance = fromAccount.balance
        fromAccount.balance = upFrontCost
        await vm.evm.journal.putAccount(caller, fromAccount)
        if (vm.common.isActivatedEIP(7928)) {
          vm.evm.blockLevelAccessList!.addBalanceChange(
            caller.toString(),
            fromAccount.balance,
            vm.evm.blockLevelAccessList!.blockAccessIndex,
            originalBalance,
          )
        }
      }
    } else {
      const msg = _errorMsg(
        `sender doesn't have enough funds to send tx. The upfront cost is: ${upFrontCost} and the sender's account (${caller}) only has: ${balance}`,
        vm,
        block,
        tx,
      )
      throw EthereumJSErrorWithoutCode(msg)
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
    maxCost += tx.gasLimit * (tx as FeeMarket1559Tx).maxFeePerGas
  }

  if (isBlob4844Tx(tx)) {
    if (!vm.common.isActivatedEIP(4844)) {
      const msg = _errorMsg('blob transactions are only valid with EIP4844 active', vm, block, tx)
      throw EthereumJSErrorWithoutCode(msg)
    }
    // EIP-4844 spec
    // the signer must be able to afford the transaction
    // assert signer(tx).balance >= tx.message.gas * tx.message.max_fee_per_gas + get_total_data_gas(tx) * tx.message.max_fee_per_data_gas
    totalblobGas = vm.common.param('blobGasPerBlob') * BigInt(tx.numBlobs())
    maxCost += totalblobGas * tx.maxFeePerBlobGas

    // 4844 minimum blobGas price check
    blobGasPrice = opts.block?.header.getBlobGasPrice() ?? DEFAULT_HEADER.getBlobGasPrice()
    if (tx.maxFeePerBlobGas < blobGasPrice) {
      const msg = _errorMsg(
        `Transaction's maxFeePerBlobGas ${tx.maxFeePerBlobGas}) is less than block blobGasPrice (${blobGasPrice}).`,
        vm,
        block,
        tx,
      )
      throw EthereumJSErrorWithoutCode(msg)
    }
  }

  if (fromAccount.balance < maxCost) {
    if (opts.skipBalance === true && fromAccount.balance < maxCost) {
      // if skipBalance, ensure caller balance is enough to run transaction
      const originalBalance = fromAccount.balance
      fromAccount.balance = maxCost
      await vm.evm.journal.putAccount(caller, fromAccount)
      if (vm.common.isActivatedEIP(7928)) {
        vm.evm.blockLevelAccessList!.addBalanceChange(
          caller.toString(),
          fromAccount.balance,
          vm.evm.blockLevelAccessList!.blockAccessIndex,
          originalBalance,
        )
      }
    } else {
      const msg = _errorMsg(
        `sender doesn't have enough funds to send tx. The max cost is: ${maxCost} and the sender's account (${caller}) only has: ${balance}`,
        vm,
        block,
        tx,
      )
      throw EthereumJSErrorWithoutCode(msg)
    }
  }

  if (opts.skipNonce !== true) {
    if (nonce !== tx.nonce) {
      const msg = _errorMsg(
        `the tx doesn't have the correct nonce. account has nonce of: ${nonce} tx has nonce of: ${tx.nonce}`,
        vm,
        block,
        tx,
      )
      throw EthereumJSErrorWithoutCode(msg)
    }
  }

  // ===========================
  // CALCULATION: Gas Price
  // ===========================
  let gasPrice: bigint
  let inclusionFeePerGas: bigint
  if (tx.supports(Capability.EIP1559FeeMarket)) {
    // TODO make txs use the new getEffectivePriorityFee
    const baseFee = block?.header.baseFeePerGas ?? DEFAULT_HEADER.baseFeePerGas!
    inclusionFeePerGas = tx.getEffectivePriorityFee(baseFee)

    gasPrice = inclusionFeePerGas + baseFee
  } else {
    // Have to cast as legacy tx since EIP1559 tx does not have gas price
    gasPrice = (tx as LegacyTx).gasPrice
    if (vm.common.isActivatedEIP(1559)) {
      const baseFee = block?.header.baseFeePerGas ?? DEFAULT_HEADER.baseFeePerGas!
      inclusionFeePerGas = (tx as LegacyTx).gasPrice - baseFee
    }
  }

  // EIP-4844 tx
  let blobVersionedHashes
  if (isBlob4844Tx(tx)) {
    blobVersionedHashes = tx.blobVersionedHashes
  }

  // ===========================
  // STATE UPDATE: Deduct Costs
  // ===========================
  const txCost = tx.gasLimit * gasPrice
  const blobGasCost = totalblobGas * blobGasPrice
  const senderOriginalBalance = fromAccount.balance
  fromAccount.balance -= txCost
  fromAccount.balance -= blobGasCost
  if (opts.skipBalance === true && fromAccount.balance < BIGINT_0) {
    fromAccount.balance = BIGINT_0
  }
  await vm.evm.journal.putAccount(caller, fromAccount)
  if (vm.common.isActivatedEIP(7928)) {
    vm.evm.blockLevelAccessList!.addBalanceChange(
      caller.toString(),
      fromAccount.balance,
      vm.evm.blockLevelAccessList!.blockAccessIndex,
      senderOriginalBalance,
    )
  }

  // Process EIP-7702 authorization list (if applicable)
  let gasRefund = BIGINT_0
  if (tx.supports(Capability.EIP7702EOACode)) {
    gasRefund = await processAuthorizationList(vm, tx as EIP7702CompatibleTx, caller, gasRefund)
  }

  if (vm.DEBUG) {
    debug(`Update fromAccount (caller) balance (-> ${fromAccount.balance}))`)
  }
  let executionTimerPrecise: number
  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(balanceNonceLabel)
    executionTimerPrecise = performance.now()
  }

  // ===========================
  // EXECUTION: Run EVM Call
  // ===========================
  const { value, data, to } = tx

  if (vm.DEBUG) {
    debug(
      `Running tx=${
        tx.isSigned() ? bytesToHex(tx.hash()) : 'unsigned'
      } with caller=${caller} gasLimit=${gasLimit} to=${
        to?.toString() ?? 'none'
      } value=${value} data=${short(data)}`,
    )
  }

  const results = (await vm.evm.runCall({
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

  if (vm.common.isActivatedEIP(7864)) {
    ;(stateAccesses as BinaryTreeAccessWitness)?.merge(txAccesses! as BinaryTreeAccessWitness)
  }

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.log(`${executionLabel}: ${performance.now() - executionTimerPrecise!}ms`)
    // eslint-disable-next-line no-console
    console.log('[ For execution details see table output ]')
    // eslint-disable-next-line no-console
    console.time(logsGasBalanceLabel)
  }

  if (vm.DEBUG) {
    debug(`Update fromAccount (caller) nonce (-> ${fromAccount.nonce})`)
  }

  if (vm.DEBUG) {
    const { executionGasUsed, exceptionError, returnValue } = results.execResult
    debug('-'.repeat(100))
    debug(
      `Received tx execResult: [ executionGasUsed=${executionGasUsed} exceptionError=${
        exceptionError !== undefined ? `'${exceptionError.error}'` : 'none'
      } returnValue=${short(returnValue)} gasRefund=${results.gasRefund ?? 0} ]`,
    )
  }

  // ===========================
  // RESULTS: Gas and Balances
  // ===========================
  // Generate the bloom for the tx
  results.bloom = txLogsBloom(results.execResult.logs, vm.common)
  if (vm.DEBUG) {
    debug(`Generated tx bloom with logs=${results.execResult.logs?.length}`)
  }

  // Calculate the total gas used
  results.totalGasSpent = results.execResult.executionGasUsed + intrinsicGas
  if (vm.DEBUG) {
    debugGas(`tx add baseFee ${intrinsicGas} to totalGasSpent (-> ${results.totalGasSpent})`)
  }

  // Add blob gas used to result
  if (isBlob4844Tx(tx)) {
    results.blobGasUsed = totalblobGas
  }

  // Process any gas refund
  gasRefund += results.execResult.gasRefund ?? BIGINT_0
  results.gasRefund = gasRefund // TODO: this field could now be incorrect with the introduction of 7623
  const maxRefundQuotient = vm.common.param('maxRefundQuotient')
  if (gasRefund !== BIGINT_0) {
    const maxRefund = results.totalGasSpent / maxRefundQuotient
    gasRefund = gasRefund < maxRefund ? gasRefund : maxRefund
    results.totalGasSpent -= gasRefund
    if (vm.DEBUG) {
      debug(`Subtract tx gasRefund (${gasRefund}) from totalGasSpent (-> ${results.totalGasSpent})`)
    }
  } else {
    if (vm.DEBUG) {
      debug(`No tx gasRefund`)
    }
  }

  if (vm.common.isActivatedEIP(7623)) {
    if (results.totalGasSpent < floorCost) {
      if (vm.DEBUG) {
        debugGas(
          `tx floorCost ${floorCost} is higher than to total execution gas spent (-> ${results.totalGasSpent}), setting floor as gas paid`,
        )
      }
      results.gasRefund = BIGINT_0
      results.totalGasSpent = floorCost
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
  const originalBalance = fromAccount.balance
  fromAccount.balance += txCostDiff

  if (vm.common.isActivatedEIP(7928)) {
    vm.evm.blockLevelAccessList!.addBalanceChange(
      caller.toString(),
      fromAccount.balance,
      vm.evm.blockLevelAccessList!.blockAccessIndex,
      originalBalance,
    )
    vm.evm.blockLevelAccessList!.addNonceChange(
      caller.toString(),
      fromAccount.nonce,
      vm.evm.blockLevelAccessList!.blockAccessIndex,
    )
  }

  await vm.evm.journal.putAccount(caller, fromAccount)
  // EIP-7928: Track sender balance change for gas refund in Block Access List
  if (vm.common.isActivatedEIP(7928) && txCostDiff > BIGINT_0) {
    vm.evm.blockLevelAccessList!.addBalanceChange(
      caller.toString(),
      fromAccount.balance,
      vm.evm.blockLevelAccessList!.blockAccessIndex,
    )
  }
  if (vm.DEBUG) {
    debug(
      `Refunded txCostDiff (${txCostDiff}) to fromAccount (caller) balance (-> ${fromAccount.balance})`,
    )
  }

  // Update miner's balance
  await updateMinerBalance(vm, state, block, results, inclusionFeePerGas!)

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(logsGasBalanceLabel)
    // eslint-disable-next-line no-console
    console.time(accountsCleanUpLabel)
  }

  // ===========================
  // CLEANUP: Accounts and State
  // ===========================
  await processSelfdestructs(vm, results)

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(accountsCleanUpLabel)
    // eslint-disable-next-line no-console
    console.time(accessListLabel)
  }

  // Build access list result if requested
  if (opts.reportAccessList === true && vm.common.isActivatedEIP(2930)) {
    results.accessList = buildAccessListResult(vm)
  }

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(accessListLabel)
    // eslint-disable-next-line no-console
    console.time(journalCacheCleanUpLabel)
  }

  // Collect preimages if requested
  if (opts.reportPreimages === true && vm.evm.journal.preimages !== undefined) {
    results.preimages = vm.evm.journal.preimages
  }

  // Clear journal and caches
  await vm.evm.journal.cleanup()
  state.originalStorageCache.clear()

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(journalCacheCleanUpLabel)
    // eslint-disable-next-line no-console
    console.time(receiptsLabel)
  }

  // ===========================
  // FINALIZE: Receipt and Events
  // ===========================
  const gasUsed = opts.blockGasUsed ?? block?.header.gasUsed ?? DEFAULT_HEADER.gasUsed
  const cumulativeGasUsed = gasUsed + results.totalGasSpent
  results.receipt = await generateTxReceipt(
    vm,
    tx,
    results,
    cumulativeGasUsed,
    totalblobGas,
    blobGasPrice,
  )

  if (enableProfiler) {
    // eslint-disable-next-line no-console
    console.timeEnd(receiptsLabel)
  }

  // EIP-7928: Clean up net-zero balance changes
  // Per spec, if an account's balance changed during tx but final == pre-tx, don't record
  if (vm.common.isActivatedEIP(7928)) {
    vm.evm.blockLevelAccessList!.cleanupNetZeroBalanceChanges()
  }

  /** The `afterTx` event - emits transaction results */
  const event: AfterTxEvent = { transaction: tx, ...results }
  await vm._emit('afterTx', event)
  if (vm.DEBUG) {
    debug(
      `tx run finished hash=${
        opts.tx.isSigned() ? bytesToHex(opts.tx.hash()) : 'unsigned'
      } sender=${caller}`,
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
 * @param vm The vm instance
 * @param tx The transaction
 * @param txResult The tx result
 * @param cumulativeGasUsed The gas used in the block including vm tx
 * @param blobGasUsed The blob gas used in the tx
 * @param blobGasPrice The blob gas price for the block including vm tx
 */
export async function generateTxReceipt(
  vm: VM,
  tx: TypedTransaction,
  txResult: RunTxResult,
  cumulativeGasUsed: bigint,
  blobGasUsed?: bigint,
  blobGasPrice?: bigint,
): Promise<TxReceipt> {
  const baseReceipt: BaseTxReceipt = {
    cumulativeBlockGasUsed: cumulativeGasUsed,
    bitvector: txResult.bloom.bitvector,
    logs: txResult.execResult.logs ?? [],
  }

  let receipt
  if (vm.DEBUG) {
    debug(
      `Generate tx receipt transactionType=${
        tx.type
      } cumulativeBlockGasUsed=${cumulativeGasUsed} bitvector=${short(baseReceipt.bitvector)} (${
        baseReceipt.bitvector.length
      } bytes) logs=${baseReceipt.logs.length}`,
    )
  }

  if (!tx.supports(Capability.EIP2718TypedTransaction)) {
    // Legacy transaction
    if (vm.common.gteHardfork(Hardfork.Byzantium)) {
      // Post-Byzantium
      receipt = {
        status: txResult.execResult.exceptionError !== undefined ? 0 : 1, // Receipts have a 0 as status on error
        ...baseReceipt,
      } as PostByzantiumTxReceipt
    } else {
      // Pre-Byzantium
      const stateRoot = await vm.stateManager.getStateRoot()
      receipt = {
        stateRoot,
        ...baseReceipt,
      } as PreByzantiumTxReceipt
    }
  } else {
    // Typed EIP-2718 Transaction
    if (isBlob4844Tx(tx)) {
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
function _errorMsg(msg: string, vm: VM, block: Block | undefined, tx: TypedTransaction) {
  const blockOrHeader = block ?? DEFAULT_HEADER
  const blockErrorStr = 'errorStr' in blockOrHeader ? blockOrHeader.errorStr() : 'block'
  const txErrorStr = 'errorStr' in tx ? tx.errorStr() : 'tx'

  const errorMsg = `${msg} (${vm.errorStr()} -> ${blockErrorStr} -> ${txErrorStr})`
  return errorMsg
}

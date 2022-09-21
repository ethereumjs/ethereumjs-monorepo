import { ConsensusType } from '@ethereumjs/common'
import { Capability } from '@ethereumjs/tx'
import { Address, KECCAK256_NULL, toBuffer } from '@ethereumjs/util'

import type { EVM } from '../../../src'
import type { Block } from '@ethereumjs/block'
import type {
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
  Transaction,
} from '@ethereumjs/tx'

export async function runTxAlt(
  evm: EVM,
  block: Block,
  tx: FeeMarketEIP1559Transaction | AccessListEIP2930Transaction | Transaction
): Promise<void> {
  if (block.header.gasLimit < tx.gasLimit) {
    const msg = 'tx has a higher gas limit than the block'
    throw new Error(msg)
  }

  const state = evm.eei
  if (evm._common.isActivatedEIP(2929) === true) {
    state.clearWarmedAccounts()
  }
  await state.checkpoint()

  if (
    tx.supports(Capability.EIP2718TypedTransaction) &&
    evm._common.isActivatedEIP(2718) === true
  ) {
    if (evm._common.isActivatedEIP(2930) === false) {
      await state.revert()
      const msg = 'Cannot run transaction: EIP 2930 is not activated.'
      throw new Error(msg)
    }
    if (tx.supports(Capability.EIP1559FeeMarket) && evm._common.isActivatedEIP(1559) === false) {
      await state.revert()
      const msg = 'Cannot run transaction: EIP 1559 is not activated.'
      throw new Error(msg)
    }

    const castedTx = <AccessListEIP2930Transaction>tx

    for (const accessListItem of castedTx.AccessListJSON) {
      const address = toBuffer(accessListItem.address)
      state.addWarmedAddress(address)
      for (const storageKey of accessListItem.storageKeys) {
        state.addWarmedStorage(address, toBuffer(storageKey))
      }
    }
  }

  try {
    await _runTx(evm, tx, block)
    await state.commit()
  } catch (e: any) {
    await state.revert()
    throw e
  } finally {
    if (evm._common.isActivatedEIP(2929) === true) {
      state.clearWarmedAccounts()
    }
  }
}

async function _runTx(
  evm: EVM,
  tx: FeeMarketEIP1559Transaction | AccessListEIP2930Transaction | Transaction,
  block: Block,
  opts = { skipBalance: false }
): Promise<void> {
  const state = evm.eei
  const caller = tx.getSenderAddress()
  if (evm._common.isActivatedEIP(2929) === true) {
    const activePrecompiles = evm.precompiles
    for (const [addressStr] of activePrecompiles.entries()) {
      state.addWarmedAddress(Buffer.from(addressStr, 'hex'))
    }
    state.addWarmedAddress(caller.buf)
    if (tx.to) {
      state.addWarmedAddress(tx.to.buf)
    }
    if (evm._common.isActivatedEIP(3651) === true) {
      state.addWarmedAddress(block.header.coinbase.buf)
    }
  }
  const txBaseFee = tx.getBaseFee()
  let gasLimit = tx.gasLimit
  if (gasLimit < txBaseFee) {
    const msg = 'base fee exceeds gas limit'
    throw new Error(msg)
  }
  gasLimit -= txBaseFee

  if (evm._common.isActivatedEIP(1559) === true) {
    const maxFeePerGas = 'maxFeePerGas' in tx ? tx.maxFeePerGas : tx.gasPrice
    const baseFeePerGas = block.header.baseFeePerGas!
    if (maxFeePerGas < baseFeePerGas) {
      const msg = `Transaction's maxFeePerGas (${maxFeePerGas}) is less than the block's baseFeePerGas (${baseFeePerGas})`
      throw new Error(msg)
    }
  }

  let fromAccount = await state.getAccount(caller)
  const { nonce, balance } = fromAccount

  if (evm._common.isActivatedEIP(3607) === true && !fromAccount.codeHash.equals(KECCAK256_NULL)) {
    const msg = 'invalid sender address, address is not EOA (EIP-3607)'
    throw new Error(msg)
  }

  const cost = tx.getUpfrontCost(block.header.baseFeePerGas)
  if (balance < cost) {
    if (opts.skipBalance === true && fromAccount.balance < cost) {
      if (tx.supports(Capability.EIP1559FeeMarket) === false) {
        // if skipBalance and not EIP1559 transaction, ensure caller balance is enough to run transaction
        fromAccount.balance = cost
        await evm.eei.putAccount(caller, fromAccount)
      }
    } else {
      const msg = `sender doesn't have enough funds to send tx. The upfront cost is: ${cost} and the sender's account (${caller}) only has: ${balance}`
      throw new Error(msg)
    }
  }
  if (nonce !== tx.nonce) {
    const msg = `the tx doesn't have the correct nonce. account has nonce of: ${nonce} tx has nonce of: ${tx.nonce}`

    throw new Error(msg)
  }

  if (tx.supports(Capability.EIP1559FeeMarket)) {
    const cost = tx.gasLimit * (tx as FeeMarketEIP1559Transaction).maxFeePerGas + tx.value
    if (balance < cost) {
      if (opts.skipBalance === true && fromAccount.balance < cost) {
        // if skipBalance, ensure caller balance is enough to run transaction
        fromAccount.balance = cost
        await evm.eei.putAccount(caller, fromAccount)
      } else {
        const msg = `sender doesn't have enough funds to send tx. The max cost is: ${cost} and the sender's account (${caller}) only has: ${balance}`
        throw new Error(msg)
      }
    }
  }

  let gasPrice: bigint
  let inclusionFeePerGas: bigint
  if (tx.supports(Capability.EIP1559FeeMarket)) {
    const baseFee = block.header.baseFeePerGas!
    inclusionFeePerGas =
      (tx as FeeMarketEIP1559Transaction).maxPriorityFeePerGas <
      (tx as FeeMarketEIP1559Transaction).maxFeePerGas - baseFee
        ? (tx as FeeMarketEIP1559Transaction).maxPriorityFeePerGas
        : (tx as FeeMarketEIP1559Transaction).maxFeePerGas - baseFee

    gasPrice = inclusionFeePerGas + baseFee
  } else {
    gasPrice = (<Transaction>tx).gasPrice
    if (evm._common.isActivatedEIP(1559) === true) {
      const baseFee = block.header.baseFeePerGas!
      inclusionFeePerGas = (<Transaction>tx).gasPrice - baseFee
    }
  }

  const txCost = tx.gasLimit * gasPrice
  fromAccount.balance -= txCost
  // if (opts.skipBalance === true && fromAccount.balance < BigInt(0)) {
  //   fromAccount.balance = BigInt(0)
  // }
  await state.putAccount(caller, fromAccount)

  const { value, data, to } = tx

  const results = await evm.runCall({
    block,
    gasPrice,
    caller,
    gasLimit,
    to,
    value,
    data,
  })

  const acc = await state.getAccount(caller)
  acc.nonce++
  await state.putAccount(caller, acc)

  let totalGasSpent = results.execResult.executionGasUsed + txBaseFee

  let gasRefund = results.execResult.gasRefund ?? BigInt(0)
  const maxRefundQuotient = evm._common.param('gasConfig', 'maxRefundQuotient')
  if (gasRefund !== BigInt(0)) {
    const maxRefund = totalGasSpent / maxRefundQuotient
    gasRefund = gasRefund < maxRefund ? gasRefund : maxRefund
    totalGasSpent -= gasRefund
  }
  const amountSpent = totalGasSpent * gasPrice

  fromAccount = await state.getAccount(caller)
  const actualTxCost = totalGasSpent * gasPrice
  const txCostDiff = txCost - actualTxCost
  fromAccount.balance += txCostDiff
  await state.putAccount(caller, fromAccount)

  let miner
  if (evm._common.consensusType() === ConsensusType.ProofOfAuthority) {
    miner = block.header.cliqueSigner()
  } else {
    miner = block.header.coinbase
  }

  const minerAccount = await state.getAccount(miner)
  if (evm._common.isActivatedEIP(1559) === true) {
    minerAccount.balance += totalGasSpent * inclusionFeePerGas!
  } else {
    minerAccount.balance += amountSpent
  }

  await state.putAccount(miner, minerAccount)

  if (results.execResult.selfdestruct) {
    const keys = Object.keys(results.execResult.selfdestruct)
    for (const k of keys) {
      const address = new Address(Buffer.from(k, 'hex'))
      await state.deleteAccount(address)
    }
  }

  await state.cleanupTouchedAccounts()
  state.clearOriginalStorageCache()
}

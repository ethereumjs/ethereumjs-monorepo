import { TransactionFactory } from '@ethereumjs/tx'
import {
  TypeOutput,
  bigIntToHex,
  intToHex,
  isHexPrefixed,
  setLengthLeft,
  toBuffer,
  toType,
} from '@ethereumjs/util'

import { blockHeaderFromRpc } from './header-from-rpc'

import { Block } from './index'

import type { BlockOptions, JsonRpcBlock } from './index'
import type { Common } from '@ethereumjs/common'
import type { TxData, TypedTransaction } from '@ethereumjs/tx'
import type { ethers } from 'ethers'

function normalizeTxParams(_txParams: any) {
  const txParams = Object.assign({}, _txParams)

  txParams.gasLimit = toType(txParams.gasLimit ?? txParams.gas, TypeOutput.BigInt)
  txParams.data = txParams.data === undefined ? txParams.input : txParams.data

  // check and convert gasPrice and value params
  txParams.gasPrice = txParams.gasPrice !== undefined ? BigInt(txParams.gasPrice) : undefined
  txParams.value = txParams.value !== undefined ? BigInt(txParams.value) : undefined

  // strict byte length checking
  txParams.to =
    txParams.to !== null && txParams.to !== undefined
      ? setLengthLeft(toBuffer(txParams.to), 20)
      : null

  txParams.v = toType(txParams.v, TypeOutput.BigInt)

  return txParams
}

/**
 * Creates a new block object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param uncles - Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)
 * @param options - An object describing the blockchain
 */
export function blockFromRpc(
  blockParams: JsonRpcBlock,
  uncles: any[] = [],
  options?: BlockOptions
) {
  const header = blockHeaderFromRpc(blockParams, options)

  const transactions: TypedTransaction[] = []
  const opts = { common: header._common }
  for (const _txParams of blockParams.transactions ?? []) {
    const txParams = normalizeTxParams(_txParams)
    const tx = TransactionFactory.fromTxData(txParams as TxData, opts)
    transactions.push(tx)
  }

  const uncleHeaders = uncles.map((uh) => blockHeaderFromRpc(uh, options))

  return Block.fromBlockData({ header, transactions, uncleHeaders }, options)
}

/**
 *  method to retrieve a block from the provider to use in the VM
 * @param provider an Ethers JsonRPCProvider
 * @param blockTag block hash or block number to be run
 * @param common Common instance used in VM
 * @returns the block specified by `blockTag`
 */
export const getBlockFromProvider = async (
  provider: ethers.providers.JsonRpcProvider,
  blockTag: string | bigint,
  common: Common
) => {
  let blockData
  if (typeof blockTag === 'string' && blockTag.length === 66) {
    blockData = await provider.send('eth_getBlockByHash', [blockTag, true])
  } else if (typeof blockTag === 'bigint') {
    blockData = await provider.send('eth_getBlockByNumber', [bigIntToHex(blockTag), true])
  } else if (
    isHexPrefixed(blockTag) ||
    blockTag === 'latest' ||
    blockTag === 'earliest' ||
    blockTag === 'pending'
  ) {
    blockData = await provider.send('eth_getBlockByNumber', [blockTag, true])
  } else {
    throw new Error(
      `expected blockTag to be block hash, bigint, hex prefixed string, or earliest/latest/pending; got ${blockTag}`
    )
  }

  const uncleHeaders = []
  if (blockData.uncles.length > 0) {
    for (let x = 0; x < blockData.uncles.length; x++) {
      const headerData = await provider.send('eth_getUncleByBlockHashAndIndex', [
        blockData.hash,
        intToHex(x),
      ])
      uncleHeaders.push(headerData)
    }
  }

  return blockFromRpc(blockData, uncleHeaders, {
    common,
  })
}

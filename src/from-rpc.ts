import { FakeTransaction } from 'ethereumjs-tx'
import * as ethUtil from 'ethereumjs-util'
import { Block, ChainOptions } from './index'

import blockHeaderFromRpc from './header-from-rpc'

/**
 * Creates a new block object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param uncles - Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)
 * @param chainOptions - An object describing the blockchain
 */
export default function blockFromRpc(
  blockParams: any,
  uncles?: any[],
  chainOptions?: ChainOptions,
) {
  uncles = uncles || []

  const header = blockHeaderFromRpc(blockParams, chainOptions)

  const block = new Block(
    {
      header: header.toJSON(true),
      transactions: [],
      uncleHeaders: uncles.map(uh => blockHeaderFromRpc(uh, chainOptions).toJSON(true)),
    },
    chainOptions,
  )

  if (blockParams.transactions) {
    for (const _txParams of blockParams.transactions) {
      const txParams = normalizeTxParams(_txParams)
      // override from address
      const fromAddress = ethUtil.toBuffer(txParams.from)
      delete txParams.from
      const tx = new FakeTransaction(txParams, chainOptions)
      tx.from = fromAddress
      tx.getSenderAddress = function() {
        return fromAddress
      }
      // override hash
      const txHash = ethUtil.toBuffer(txParams.hash)
      tx.hash = function() {
        return txHash
      }

      block.transactions.push(tx)
    }
  }

  return block
}

function normalizeTxParams(_txParams: any) {
  const txParams = Object.assign({}, _txParams)
  // hot fix for https://github.com/ethereumjs/ethereumjs-util/issues/40
  txParams.gasLimit = txParams.gasLimit === undefined ? txParams.gas : txParams.gasLimit
  txParams.data = txParams.data === undefined ? txParams.input : txParams.data
  // strict byte length checking
  txParams.to = txParams.to ? ethUtil.setLengthLeft(ethUtil.toBuffer(txParams.to), 20) : null
  // v as raw signature value {0,1}
  txParams.v = txParams.v < 27 ? txParams.v + 27 : txParams.v
  return txParams
}

import { Transaction, TxData } from '@ethereumjs/tx'
import { toBuffer, setLengthLeft, Address } from 'ethereumjs-util'
import { Block, BlockOptions } from './index'

import blockHeaderFromRpc from './header-from-rpc'

/**
 * Creates a new block object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param uncles - Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)
 * @param chainOptions - An object describing the blockchain
 */
export default function blockFromRpc(blockParams: any, uncles?: any[], options?: BlockOptions) {
  uncles = uncles || []

  const header = blockHeaderFromRpc(blockParams, options)

  const block = new Block(
    {
      header: header.toJSON(true),
      transactions: [],
      uncleHeaders: uncles.map((uh) => blockHeaderFromRpc(uh, options).toJSON(true)),
    },
    options,
  )

  if (blockParams.transactions) {
    for (const _txParams of blockParams.transactions) {
      const txParams = normalizeTxParams(_txParams)

      // override from address
      const fromAddress = txParams.from ? Address.fromString(txParams.from) : Address.zero()
      delete txParams.from

      const tx = Transaction.fromTxData(txParams as TxData, (<any>block)._common)
      const fakeTx = Object.create(tx)

      // override getSenderAddress
      fakeTx.getSenderAddress = () => {
        return fromAddress
      }
      // override hash
      fakeTx.hash = () => {
        return toBuffer(txParams.hash)
      }

      block.transactions.push(fakeTx)
    }
  }

  return block
}

function normalizeTxParams(_txParams: any) {
  const txParams = Object.assign({}, _txParams)

  txParams.gasLimit = txParams.gasLimit === undefined ? txParams.gas : txParams.gasLimit
  txParams.data = txParams.data === undefined ? txParams.input : txParams.data

  // strict byte length checking
  txParams.to = txParams.to ? setLengthLeft(toBuffer(txParams.to), 20) : null

  // v as raw signature value {0,1}
  // v is the recovery bit and can be either {0,1} or {27,28}.
  // https://ethereum.stackexchange.com/questions/40679/why-the-value-of-v-is-always-either-27-11011-or-28-11100
  const v: number = txParams.v
  txParams.v = v < 27 ? v + 27 : v

  return txParams
}

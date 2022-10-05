import { TypeOutput, setLengthLeft, toBuffer, toType } from '@ethereumjs/util'

import { TransactionFactory } from './transactionFactory'

import type { TxOptions } from './types'
import type { ethers } from 'ethers'

const normalizeTxParams = (_txParams: any) => {
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

export const txFromRpc = async (
  provider: ethers.providers.JsonRpcProvider,
  txHash: string,
  txOpts?: TxOptions
) => {
  const txData = await provider.send('eth_getTransactionByHash', [txHash])
  const normedTx = normalizeTxParams(txData)
  return TransactionFactory.fromTxData(normedTx, txOpts)
}

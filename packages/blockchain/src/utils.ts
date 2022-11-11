import { addHexPrefix, bigIntToHex, isHexPrefixed } from '@ethereumjs/util'

import type { GenesisState } from './genesisStates'
import type { BlockHeader } from '@ethereumjs/block'
import type { BlobEIP4844Transaction } from '@ethereumjs/tx'
/**
 * Parses the geth genesis state into Blockchain {@link GenesisState}
 * @param json representing the `alloc` key in a Geth genesis file
 */
export function parseGethGenesisState(json: any) {
  const state: GenesisState = {}
  for (let address of Object.keys(json.alloc)) {
    let { balance, code, storage } = json.alloc[address]
    address = addHexPrefix(address)
    balance = isHexPrefixed(balance) ? balance : bigIntToHex(BigInt(balance))
    code = code !== undefined ? addHexPrefix(code) : undefined
    storage = storage !== undefined ? Object.entries(storage) : undefined
    state[address] = [balance, code, storage] as any
  }
  return state
}

// TODO: Decide if these should be here or in Blockchain or somewhere else

/**
 * Approximates `factor * e ** (numerator / denominator)` using Taylor expansion
 */
export const fakeExponential = (factor: bigint, numerator: bigint, denominator: bigint) => {
  let i = BigInt(1)
  let output = BigInt(0)
  let numerator_accum = factor * denominator
  while (numerator_accum > BigInt(0)) {
    output += numerator_accum
    numerator_accum = BigInt(Math.floor(Number((numerator_accum * numerator) / (denominator * i))))
    i++
  }
  return BigInt(Math.floor(Number(output / denominator)))
}

export const getDataGasPrice = (header: BlockHeader) => {
  if (header.excessDataGas === undefined) {
    throw new Error('parent header must have excessDataGas field populated')
  }
  return fakeExponential(
    header._common.param('gasPrices', 'minDataGasPrice'),
    header.excessDataGas,
    header._common.param('gasConfig', 'dataGasPriceUpdateFraction')
  )
}
export const calcDataFee = (tx: BlobEIP4844Transaction, parent: BlockHeader) => {
  if (parent.excessDataGas === undefined) {
    throw new Error('parent header must have excessDataGas field populated')
  }
  const totalDataGas =
    parent._common.param('gasConfig', 'dataGasPerBlob') * BigInt(tx.versionedHashes.length)
  const dataGasPrice = getDataGasPrice(parent)
  return totalDataGas * dataGasPrice
}

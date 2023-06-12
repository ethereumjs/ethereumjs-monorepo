import { addHexPrefix, bigIntToHex, isHexPrefixed } from '@ethereumjs/util'

import type { GenesisState } from './types'

/**
 * Parses the geth genesis state into Blockchain {@link GenesisState}
 * @param json representing the `alloc` key in a Geth genesis file
 */
export function parseGethGenesisState(json: any) {
  const state: GenesisState = {}
  for (let address of Object.keys(json.alloc)) {
    let { balance, code, storage, nonce } = json.alloc[address]
    address = addHexPrefix(address)
    balance = isHexPrefixed(balance) ? balance : bigIntToHex(BigInt(balance))
    code = code !== undefined ? addHexPrefix(code) : undefined
    storage = storage !== undefined ? Object.entries(storage) : undefined
    nonce = nonce !== undefined ? addHexPrefix(nonce) : undefined
    state[address] = [balance, code, storage, nonce]
  }
  return state
}

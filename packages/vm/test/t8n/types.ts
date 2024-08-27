import type { PrefixedHexString } from '@ethereumjs/util'

export type T8NOptions = {
  state: {
    fork: string
    reward: bigint
    chainid: bigint
  }
  input: {
    alloc: string
    txs: string
    env: string
  }
  output: {
    basedir: string
    result: string
    alloc: string
    body: string
  }
}

export type T8NAlloc = {
  [address: string]: {
    nonce?: string
    balance: string
    code?: string
    storage: {
      [key: string]: string
    }
  }
}

export type T8NEnv = {
  currentCoinbase: PrefixedHexString
  currentGasLimit: string
  currentNumber: string
  currentTimestamp: string
  currentRandom?: string
  currentDifficulty: string
  parentDifficulty: string
  parentTimestamp: string
  parentBaseFee: string
  parentGasUsed: string
  parentGasLimit: string
  parentUncleHash: PrefixedHexString
  parentBlobGasUsed?: string
  parentExcessBlobGas?: string
  parentBeaconBlockRoot?: PrefixedHexString
  blockHashes: {
    [number: string]: PrefixedHexString
  }
  ommers: PrefixedHexString[]
  withdrawals: string[]
  parentHash: PrefixedHexString
}

export type RunnerOptions = {
  log?: boolean
}

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
  }
  log: boolean
  trace: boolean
}

export type T8NAlloc = {
  // These are all PrefixedHexString, but TypeScript fails to coerce these in some places for some reason
  [address: string]: {
    nonce?: string
    balance: string
    code?: string
    storage?: {
      [key: string]: string
    }
  }
}

export type T8NEnv = {
  currentCoinbase: string
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
  parentUncleHash: string
  parentBlobGasUsed?: string
  parentExcessBlobGas?: string
  parentBeaconBlockRoot?: string
  blockHashes: {
    [number: string]: string
  }
  ommers: string[]
  withdrawals: string[]
  parentHash: string
}

export type T8NRejectedTx = { index: number; error: string }

export type T8NOutput = {
  stateRoot: string
  txRoot: string
  receiptsRoot: string
  logsHash: string
  logsBloom: string
  receipts: T8NReceipt[]
  gasUsed: string
  currentBaseFee?: string
  withdrawalsRoot?: string
  blobGasUsed?: string
  currentExcessBlobGas?: string
  requestsHash?: string
  requests?: string[]
  rejected?: T8NRejectedTx[]
}

type T8NLog = {
  address: string
  topics: string[]
  data: string
  blockNumber: string
  transactionHash: string
  transactionIndex: string
  blockHash: string
  logIndex: string
  removed: 'false'
}

export type T8NReceipt = {
  root: string
  status: string
  cumulativeGasUsed: string
  logsBloom: string
  logs: T8NLog[]
  transactionHash: string
  contractAddress: string
  gasUsed: string
  blockHash: string
  transactionIndex: string
}

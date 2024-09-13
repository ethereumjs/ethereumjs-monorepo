import type {
  ConsolidationRequestV1,
  DepositRequestV1,
  WithdrawalRequestV1,
} from '@ethereumjs/util'

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
  // TODO these are all string
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

export type RunnerOptions = {
  log?: boolean
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
  requestsRoot?: string
  depositRequests?: DepositRequestV1[]
  withdrawalRequests?: WithdrawalRequestV1[]
  consolidationRequests?: ConsolidationRequestV1[]
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

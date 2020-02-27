export type ForkName =
  | 'Istanbul'
  | 'Byzantium'
  | 'Constantinople'
  | 'EIP150'
  | 'EIP158'
  | 'Frontier'
  | 'Homestead'

export type ForkNamesMap = { [forkName in ForkName]: string }

export interface TxData {
  data: string
  gasLimit: string
  gasPrice: string
  nonce: string
  to: string
  value: string

  v: string
  r: string
  s: string
}

export interface FakeTxData extends TxData {
  from: string
}

// The type of each entry from ./ttTransactionTestEip155VitaliksTests.json
export interface VitaliksTestsDataEntry {
  blocknumber: string
  hash: string
  rlp: string
  sender: string
  transaction: TxData
}

// The type of ./txs.json
export type TxsJsonEntry = {
  privateKey: string
  sendersAddress: string
  type: string
  cost: number
  raw: string[]
}

export type ForksData = { [forkName in ForkName]: { hash?: string; sender?: string } }

export type OfficialTransactionTestData = ForksData & {
  _info: {
    comment: string
    filledwith: string
    lllcversion: string
    source: string
    sourceHash: string
  }
  rlp: string
}

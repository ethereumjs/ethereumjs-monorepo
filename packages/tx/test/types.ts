export type ForkName =
  | 'Prague'
  | 'Cancun'
  | 'Shanghai'
  | 'Paris'
  | 'London+3860'
  | 'London'
  | 'Berlin'
  | 'Istanbul'
  | 'Byzantium'
  | 'ConstantinopleFix'
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

// The type of each entry from ./ttTransactionTestEip155VitaliksTests.json // cspell:disable-line
// cspell:disable
export interface VitaliksTestsDataEntry {
  // cspell:enable
  blocknumber: string
  hash: string
  rlp: string
  sender: string
  transaction: TxData
}

// The type of ./txs.json
export type TxsJSONEntry = {
  privateKey: string
  sendersAddress: string
  type: string
  cost: number
  raw: string[]
  data: TxData
}

export type ForksData = {
  [forkName in ForkName]: { hash?: string; sender?: string; exception?: string }
}

export type OfficialTransactionTestData = {
  _info: {
    comment: string
    filledwith: string // cspell:disable-line
    lllcversion: string // cspell:disable-line
    source: string
    sourceHash: string
  }
  result: ForksData
  txbytes: string
}

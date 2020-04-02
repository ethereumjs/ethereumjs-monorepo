export = Block
declare class Block {
  constructor(data: any)
  transactions: any
  uncleHeaders: any
  txTrie: any
  header: any
  genTxTrie(cb: any): void
  hash(): any
  isGenesis(): any
  serialize(rlpEncode: any): any
  setGenesisParams(): void
  toJSON(labeled: any): any
  validate(blockChain: any, cb: any): void
  validateTransactions(stringError: any): any
  validateTransactionsTrie(): any
  validateUncles(blockChain: any, cb: any): any
  validateUnclesHash(): any
}

declare namespace Block {
  class Header {
    hash(): any
    public raw: any
    constructor(data: any, opts?: any)
  }
}

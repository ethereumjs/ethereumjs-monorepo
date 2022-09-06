//@ts-nocheck
import { Account } from '@ethereumjs/util'
import { JsonRpcProvider } from '@ethersproject/providers'

import * as block500000 from './testdata/providerData/block0x7a120.json'
export function createAccount(nonce = BigInt(0), balance = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}

export class MockProvider extends JsonRpcProvider {
  send = async (method: string, params: Array<any>) => {
    switch (method) {
      case 'eth_getProof':
        return this.getProofValues(params as any)
      case 'eth_getBlockByNumber':
        return this.getBlockValues(params as any)
      default:
        return 'method not implemented'
    }
  }

  private getProofValues = (params: [address: string, _: [], blockTag: bigint | string]) => {
    switch (params[0]) {
      case block500000.blockMinus1.testAccountProof.address:
        return params[2] === '0x7a120'
          ? block500000.block.testAccountProof
          : block500000.blockMinus1.testAccountProof
    }
  }

  private getBlockValues = (params: [blockTag: string, includeTransactions: boolean]) => {
    switch (params[0]) {
      case block500000.block.number:
        return block500000.block
      case block500000.blockMinus1.number:
        return block500000.blockMinus1
    }
  }
}

import { JsonRpcProvider } from '@ethersproject/providers'

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
    const [address, _, blockTag] = params
    const account = require(`./accounts/${address}.json`)
    return account[blockTag.toString()]
  }

  private getBlockValues = (params: [blockTag: string, _: boolean]) => {
    const [blockTag, _] = params
    const block = require(`./blocks/block${blockTag.toString()}.json`)
    return block
  }
}

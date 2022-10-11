import { ethers } from 'ethers'

export class MockProvider extends ethers.providers.JsonRpcProvider {
  send = async (method: string, params: Array<any>) => {
    switch (method) {
      case 'eth_getBlockByHash':
        return this.getBlockValues(params as any)
      case 'eth_chainId': // Always pretends to be mainnet
        return 1
      default:
        throw new Error(`method ${method} not implemented`)
    }
  }

  private getBlockValues = async (_params: any) => {
    const block = await import(`./testdata/infura15571241wtxns.json`)
    return block
  }
}

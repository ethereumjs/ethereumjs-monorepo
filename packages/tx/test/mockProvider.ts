import { JsonRpcProvider } from '@ethersproject/providers'

export class MockProvider extends JsonRpcProvider {
  send = async (method: string, params: Array<any>) => {
    switch (method) {
      case 'eth_chainId': // Always pretends to be mainnet
        return 1
      case 'eth_getTransactionByHash':
        return this.getTransactionData(params as any)
      default:
        throw new Error(`method ${method} not implemented`)
    }
  }

  private getTransactionData = async (_params: [txHash: string]) => {
    const txData = await import(`./json/rpcTx.json`)
    return txData
  }
}

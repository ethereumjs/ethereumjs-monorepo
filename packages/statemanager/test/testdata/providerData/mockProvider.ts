import { JsonRpcProvider } from '@ethersproject/providers'

export class MockProvider extends JsonRpcProvider {
  send = async (method: string, params: Array<any>) => {
    switch (method) {
      case 'eth_getProof':
        return this.getProofValues(params as any)
      case 'eth_getBlockByNumber':
        return this.getBlockValues(params as any)
      case 'eth_chainId': // Always pretends to be mainnet
        return 1
      case 'eth_getTransactionByHash':
        return this.getTransactionData(params as any)
      case 'eth_getCode':
        return 0
      case 'eth_getStorageAt':
        return '0xabcd'
      default:
        throw new Error(`method ${method} not implemented`)
    }
  }

  private getProofValues = async (params: [address: string, _: [], blockTag: bigint | string]) => {
    const [address, _slot, blockTag] = params
    const account = await import(`./accounts/${address}.json`)
    return account[blockTag.toString() ?? 'latest']
  }

  private getBlockValues = async (params: [blockTag: string, _: boolean]) => {
    const [blockTag, _] = params

    if (blockTag.slice(0, 2) !== '0x')
      return {
        number: 'latest',
        stateRoot: '0x2ffb7ec5bbe8616c24a222737f0817f389d00ab9268f9574e0b7dfe251fbfa05',
      }
    const block = await import(`./blocks/block${blockTag.toString()}.json`)
    return block
  }

  private getTransactionData = async (params: [txHash: string]) => {
    const [txHash] = params
    const txData = await import(`./transactions/${txHash}.json`)
    return txData
  }
}

import { JsonRpcProvider, Network } from 'ethers'

import type { FetchRequest, JsonRpcPayload, JsonRpcResult } from 'ethers'

export class MockProvider extends JsonRpcProvider {
  constructor() {
    super('localhost:8545', Network.from('mainnet'), { staticNetwork: Network.from('mainnet') })
  }

  _getConnection(): FetchRequest {
    const fakeConnection = {
      url: 'localhost:8545',
    }
    return fakeConnection as FetchRequest
  }

  private getAccountValue = async (method: string, params: Array<any>) => {
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

  _send = async (payload: JsonRpcPayload | JsonRpcPayload[]): Promise<JsonRpcResult[]> => {
    const { method, params, id } = payload as JsonRpcPayload

    switch (method) {
      case 'eth_getProof':
        return [
          {
            id,
            result: this.getProofValues(params as any),
          },
        ]
      case 'eth_getBlockByNumber':
        return [
          {
            id,
            result: this.getBlockValues(params as any),
          },
        ]
      case 'eth_chainId': // Always pretends to be mainnet
        return [
          {
            id,
            result: 1,
          },
        ]
      case 'eth_getTransactionByHash':
        return [
          {
            id,
            result: this.getTransactionData(params as any),
          },
        ]
      case 'eth_getCode': {
        let code = '0x'
        if ((params as any[])[0] !== '0xd8da6bf26964af9d7eed9e03e53415d37aa96045') {
          code = '0xab'
        }
        return [
          {
            id,
            result: code,
          },
        ]
      }
      case 'eth_getStorageAt':
        return [
          {
            id,
            result: '0xabcd',
          },
        ]
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

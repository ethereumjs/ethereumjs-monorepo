import type { JsonBlock } from '@ethereumjs/block'

export type SupportedMethods =
  | 'eth_getProof'
  | 'eth_getStorageAt'
  | 'eth_getCode'
  | 'eth_getBlockByNumber'
  | 'eth_getTransactionByHash'

export type JsonReturnType = {
  eth_getProof: { id: number; result: any }
  eth_getStorageAt: { id: number; result: any }
  eth_getCode: { id: number; result: string }
  eth_getBlockByNumber: { id: number; result: JsonBlock }
  eth_getTransactionByHash: { id: number; result: any }
}
export const getValues = async <Method extends SupportedMethods>(
  method: Method,
  id: number,
  params: any[],
): Promise<JsonReturnType[Method]> => {
  switch (method) {
    case 'eth_getProof':
      return {
        id,
        result: await getProofValues(params as any),
      }

    case 'eth_getBlockByNumber':
      return {
        id,
        result: await getBlockValues(params as any),
      }

    case 'eth_getTransactionByHash':
      return {
        id,
        result: await getTransactionData(params as any),
      }

    case 'eth_getCode': {
      let code = '0x'
      if (params[0] !== '0xd8da6bf26964af9d7eed9e03e53415d37aa96045') {
        code = '0xab'
      }
      return {
        id,
        result: code,
      }
    }
    case 'eth_getStorageAt':
      return {
        id,
        result: '0xabcd',
      }

    default:
      throw new Error(`${method} not supported in tests`)
  }
}

const getProofValues = async (params: [address: string, _: [], blockTag: bigint | string]) => {
  const [address, _slot, blockTag] = params
  try {
    const account = (await import(`./accounts/${address}.json`)).default
    return account[blockTag.toString() ?? 'latest']
  } catch {
    return {
      address,
      balance: '0x0',
      codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      nonce: '0x0',
      storageHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      storageProof: [],
    }
  }
}

const getBlockValues = async (params: [blockTag: string, _: boolean]) => {
  const [blockTag, _] = params
  if (blockTag.slice(0, 2) !== '0x')
    return {
      number: 'latest',
      stateRoot: '0x2ffb7ec5bbe8616c24a222737f0817f389d00ab9268f9574e0b7dfe251fbfa05',
    }
  const block = await import(`./blocks/block${blockTag}.json`)
  return block.default
}

const getTransactionData = async (params: [txHash: string]) => {
  const [txHash] = params
  const txData = await import(`./transactions/${txHash}.json`)
  return txData
}

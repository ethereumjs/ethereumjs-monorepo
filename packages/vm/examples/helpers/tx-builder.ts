import { defaultAbiCoder as AbiCoder, Interface } from '@ethersproject/abi'

import type { LegacyTxData } from '@ethereumjs/tx'

export const encodeFunction = (
  method: string,
  params?: {
    types: any[]
    values: unknown[]
  },
): string => {
  const parameters = params?.types ?? []
  const methodWithParameters = `function ${method}(${parameters.join(',')})`
  const signatureHash = new Interface([methodWithParameters]).getSighash(method)
  const encodedArgs = AbiCoder.encode(parameters, params?.values ?? [])

  return signatureHash + encodedArgs.slice(2)
}

export const encodeDeployment = (
  bytecode: string,
  params?: {
    types: any[]
    values: unknown[]
  },
) => {
  const deploymentData = '0x' + bytecode
  if (params) {
    const argumentsEncoded = AbiCoder.encode(params.types, params.values)
    return deploymentData + argumentsEncoded.slice(2)
  }
  return deploymentData
}

export const buildTransaction = (data: Partial<LegacyTxData>): LegacyTxData => {
  const defaultData: Partial<LegacyTxData> = {
    nonce: BigInt(0),
    gasLimit: 2_000_000, // We assume that 2M is enough,
    gasPrice: 1,
    value: 0,
    data: '0x',
  }

  return {
    ...defaultData,
    ...data,
  }
}

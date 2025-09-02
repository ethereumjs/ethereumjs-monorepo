import type { LegacyTxData } from '@ethereumjs/tx'

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

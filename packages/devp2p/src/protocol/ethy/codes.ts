export const EthyMessageCodes = {
  STATUS: 0x00,
  GET_BUCKET_MANIFEST: 0x01,
  BUCKET_MANIFEST: 0x02,
  GET_PROVEN_ACCOUNT_CHUNK: 0x03,
  PROVEN_ACCOUNT_CHUNK: 0x04,
  GET_PROVEN_STORAGE_OR_CODE: 0x05,
  PROVEN_STORAGE_OR_CODE: 0x06,
  GET_BAL_RANGE: 0x07,
  BAL_RANGE: 0x08,
  GET_ETHY_PEERS: 0x09,
  ETHY_PEERS: 0x0a,
} as const

export type EthyMessageCodes = (typeof EthyMessageCodes)[keyof typeof EthyMessageCodes]

export const EthyMessageCodeNames: { [key in EthyMessageCodes]: string } = Object.entries(
  EthyMessageCodes,
).reduce(
  (acc, [key, value]) => {
    acc[value as EthyMessageCodes] = key
    return acc
  },
  {} as { [key in EthyMessageCodes]: string },
)

export const EthMessageCodes = {
  // eth62
  STATUS: 0x00,
  NEW_BLOCK_HASHES: 0x01,
  TX: 0x02,
  GET_BLOCK_HEADERS: 0x03,
  BLOCK_HEADERS: 0x04,
  GET_BLOCK_BODIES: 0x05,
  BLOCK_BODIES: 0x06,
  NEW_BLOCK: 0x07,

  // eth65
  NEW_POOLED_TRANSACTION_HASHES: 0x08,
  GET_POOLED_TRANSACTIONS: 0x09,
  POOLED_TRANSACTIONS: 0x0a,

  // eth63
  GET_NODE_DATA: 0x0d,
  NODE_DATA: 0x0e,
  GET_RECEIPTS: 0x0f,
  RECEIPTS: 0x10,

  // eth69
  BLOCK_RANGE_UPDATE: 0x11,

  // eth71
  GET_BLOCK_ACCESS_LISTS: 0x12,
  BLOCK_ACCESS_LISTS: 0x13,

  // eth72
  GET_CELLS: 0x14,
  CELLS: 0x15,
} as const

export type EthMessageCodes = (typeof EthMessageCodes)[keyof typeof EthMessageCodes]

export const EthMessageCodeNames: { [key in EthMessageCodes]: string } = Object.entries(
  EthMessageCodes,
).reduce(
  (acc, [key, value]) => {
    acc[value as EthMessageCodes] = key
    return acc
  },
  {} as { [key in EthMessageCodes]: string },
)

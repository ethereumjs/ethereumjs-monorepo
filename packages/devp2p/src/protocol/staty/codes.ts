export const StatyMessageCodes = {
  STATUS: 0x00,
  GET_EPOCH_MANIFEST: 0x01,
  EPOCH_MANIFEST: 0x02,
  GET_EPOCH_PART: 0x03,
  EPOCH_PART: 0x04,
  GET_WITNESSES: 0x05,
  WITNESSES: 0x06,
  GET_BYTECODES: 0x07,
  BYTECODES: 0x08,
  GET_STATY_PEERS: 0x09,
  STATY_PEERS: 0x0a,
} as const

export type StatyMessageCodes = (typeof StatyMessageCodes)[keyof typeof StatyMessageCodes]

export const StatyMessageCodeNames: { [key in StatyMessageCodes]: string } = Object.entries(
  StatyMessageCodes,
).reduce(
  (acc, [key, value]) => {
    acc[value as StatyMessageCodes] = key
    return acc
  },
  {} as { [key in StatyMessageCodes]: string },
)

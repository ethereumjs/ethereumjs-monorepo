import {
  type Address,
  SYSTEM_ADDRESS_BYTES,
  bigIntToBytes,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import type { Log } from './types.ts'

/** EIP-7708 system address (canonical SYSTEM_ADDRESS_BYTES from util) */
export const EIP7708_SYSTEM_ADDRESS = SYSTEM_ADDRESS_BYTES

/**
 * EIP-7708: keccak256('Transfer(address,address,uint256)')
 * This matches the ERC-20 Transfer event signature
 */
export const EIP7708_TRANSFER_TOPIC = hexToBytes(
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
)

/**
 * EIP-7708: keccak256('Selfdestruct(address,uint256)')
 * Emitted when a contract selfdestructs and burns remaining balance
 */
export const EIP7708_SELFDESTRUCT_TOPIC = hexToBytes(
  '0x4bfaba3443c1a1836cd362418edc679fc96cae8449cbefccb6457cdf2c943083',
)

/**
 * Creates an EIP-7708 ETH transfer log (used for CALL/CREATE value transfers).
 * EIP-7708 logs are emitted from the system address with Transfer(address,address,uint256) topic.
 */
export function createEIP7708TransferLog(from: Address, to: Address, value: bigint): Log {
  const fromTopic = setLengthLeft(from.bytes, 32)
  const toTopic = setLengthLeft(to.bytes, 32)
  const data = setLengthLeft(bigIntToBytes(value), 32)
  return [EIP7708_SYSTEM_ADDRESS, [EIP7708_TRANSFER_TOPIC, fromTopic, toTopic], data]
}

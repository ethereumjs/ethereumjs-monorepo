import {
  type Address,
  SYSTEM_ADDRESS_BYTES,
  bigIntToBytes,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import type { Log } from './types.ts'

/**
 * EIP-7708 system address (canonical `SYSTEM_ADDRESS_BYTES` from `@ethereumjs/util`).
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export const EIP7708_SYSTEM_ADDRESS = SYSTEM_ADDRESS_BYTES

/**
 * EIP-7708: `keccak256('Transfer(address,address,uint256)')`.
 * Matches the ERC-20 Transfer event signature.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export const EIP7708_TRANSFER_TOPIC = hexToBytes(
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
)

/**
 * EIP-7708: `keccak256('Burn(address,uint256)')`.
 * LOG2 topic for burn logs on same-tx selfdestruct and account removal.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export const EIP7708_BURN_TOPIC = hexToBytes(
  '0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5',
)

/**
 * Creates an EIP-7708 ETH transfer log (used for CALL/CREATE value transfers).
 * Logs are emitted from the system address with `Transfer(address,address,uint256)` topics.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function createEIP7708TransferLog(from: Address, to: Address, value: bigint): Log {
  const fromTopic = setLengthLeft(from.bytes, 32)
  const toTopic = setLengthLeft(to.bytes, 32)
  const data = setLengthLeft(bigIntToBytes(value), 32)
  return [EIP7708_SYSTEM_ADDRESS, [EIP7708_TRANSFER_TOPIC, fromTopic, toTopic], data]
}

/**
 * Creates an EIP-7708 burn log (LOG2) for a burned account balance.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function createEIP7708BurnLog(account: Address, value: bigint): Log {
  const accountTopic = setLengthLeft(account.bytes, 32)
  const data = setLengthLeft(bigIntToBytes(value), 32)
  return [EIP7708_SYSTEM_ADDRESS, [EIP7708_BURN_TOPIC, accountTopic], data]
}

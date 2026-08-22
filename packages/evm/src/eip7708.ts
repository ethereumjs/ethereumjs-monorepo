import {
  type Address,
  type PrefixedHexString,
  SYSTEM_ADDRESS_BYTES,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  equalsBytes,
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
 * Builds an EIP-7708 ETH transfer log for CALL/CREATE value moves.
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
 * Builds an EIP-7708 burn log (LOG2) for an account balance removed on selfdestruct.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function createEIP7708BurnLog(account: Address, value: bigint): Log {
  const accountTopic = setLengthLeft(account.bytes, 32)
  const data = setLengthLeft(bigIntToBytes(value), 32)
  return [EIP7708_SYSTEM_ADDRESS, [EIP7708_BURN_TOPIC, accountTopic], data]
}

/**
 * Parses a system-address EIP-7708 Transfer log into from/to/value.
 *
 * @returns `undefined` when the emitter or topics do not match EIP-7708 transfer layout.
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function decodeEIP7708TransferLog(
  log: Log,
): { from: PrefixedHexString; to: PrefixedHexString; value: bigint } | undefined {
  const [address, topics, data] = log
  if (topics.length !== 3 || !equalsBytes(topics[0], EIP7708_TRANSFER_TOPIC)) {
    return undefined
  }
  if (!equalsBytes(address, EIP7708_SYSTEM_ADDRESS)) {
    return undefined
  }
  return {
    from: bytesToHex(topics[1].slice(-20)),
    to: bytesToHex(topics[2].slice(-20)),
    value: bytesToBigInt(data),
  }
}

/**
 * Parses a system-address EIP-7708 Burn log into account/value.
 *
 * @returns `undefined` when the emitter or topics do not match EIP-7708 burn layout.
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function decodeEIP7708BurnLog(
  log: Log,
): { account: PrefixedHexString; value: bigint } | undefined {
  const [address, topics, data] = log
  if (topics.length !== 2 || !equalsBytes(topics[0], EIP7708_BURN_TOPIC)) {
    return undefined
  }
  if (!equalsBytes(address, EIP7708_SYSTEM_ADDRESS)) {
    return undefined
  }
  return {
    account: bytesToHex(topics[1].slice(-20)),
    value: bytesToBigInt(data),
  }
}

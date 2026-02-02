import type { Address } from './address.ts'
import { bigIntToBytes, hexToBytes, setLengthLeft } from './bytes.ts'

/**
 * EIP-7708: System address that emits ETH transfer logs
 * 0xfffffffffffffffffffffffffffffffffffffffe
 */
export const EIP7708_SYSTEM_ADDRESS = hexToBytes('0xfffffffffffffffffffffffffffffffffffffffe')

/**
 * EIP-7708: keccak256('Transfer(address,address,uint256)')
 * This matches the ERC-20 Transfer event signature
 */
export const EIP7708_TRANSFER_TOPIC = hexToBytes(
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
)

/**
 * Log tuple type conforming to EIP-7708
 * [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]
 */
export type EthTransferLog = [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]

/**
 * Creates an EIP-7708 ETH transfer log
 * @param from - The sender address
 * @param to - The recipient address
 * @param value - The amount transferred in Wei
 * @returns A Log tuple conforming to EIP-7708
 */
export function createEIP7708TransferLog(
  from: Address,
  to: Address,
  value: bigint,
): EthTransferLog {
  // topics[1]: from address (zero prefixed to fill uint256)
  const fromTopic = setLengthLeft(from.bytes, 32)
  // topics[2]: to address (zero prefixed to fill uint256)
  const toTopic = setLengthLeft(to.bytes, 32)
  // data: amount in Wei (big endian uint256)
  const data = setLengthLeft(bigIntToBytes(value), 32)

  return [EIP7708_SYSTEM_ADDRESS, [EIP7708_TRANSFER_TOPIC, fromTopic, toTopic], data]
}

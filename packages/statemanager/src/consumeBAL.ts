import {
  type BALJSONBlockAccessList,
  EthereumJSErrorWithoutCode,
  KECCAK256_NULL,
  bytesToHex,
  createAddressFromString,
  equalsBytes,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'

import type { StateManagerInterface } from '@ethereumjs/common'

/**
 * Apply an EIP-7928 block-level access list onto `stateManager` without
 * executing transactions. Last post-balance / nonce / code / storage win;
 * EIP-161 empty accounts are deleted. Optionally checks `expectedStateRoot`.
 *
 * Shared by every state manager in this package (`sm.consumeBAL(...)`).
 * Custom `StateManagerInterface` implementations can call this helper or
 * leave `consumeBAL` unimplemented (it is optional on the interface).
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export async function consumeBAL(
  stateManager: StateManagerInterface,
  bal: BALJSONBlockAccessList,
  expectedStateRoot?: Uint8Array,
): Promise<void> {
  for (const acc of bal) {
    if (
      acc.balanceChanges.length === 0 &&
      acc.nonceChanges.length === 0 &&
      acc.codeChanges.length === 0 &&
      acc.storageChanges.length === 0
    ) {
      continue
    }
    const address = createAddressFromString(acc.address)
    const lastBalanceChange = acc.balanceChanges.at(-1)
    const balance =
      lastBalanceChange?.postBalance !== undefined
        ? hexToBigInt(lastBalanceChange.postBalance)
        : undefined
    const lastNonceChange = acc.nonceChanges.at(-1)
    const nonce =
      lastNonceChange?.postNonce !== undefined ? hexToBigInt(lastNonceChange.postNonce) : undefined
    const code = acc.codeChanges.slice(-1)[0]?.newCode ?? undefined
    if (code !== undefined) {
      await stateManager.putCode(address, hexToBytes(code))
    }

    // Read the account after any code update to get the current codeHash
    const existingAccount = await stateManager.getAccount(address)
    const finalBalance = balance ?? existingAccount?.balance ?? 0n
    const finalNonce = nonce ?? existingAccount?.nonce ?? 0n
    const finalCodeHash = existingAccount?.codeHash ?? KECCAK256_NULL

    if (
      finalBalance === 0n &&
      finalNonce === 0n &&
      equalsBytes(finalCodeHash, KECCAK256_NULL) &&
      acc.storageChanges.length === 0
    ) {
      // The account is empty (EIP-161). Delete it rather than writing a zero-balance
      // entry into the trie. This correctly handles contracts created and selfdestructed
      // in the same transaction, where the BAL records postBalance=0 but EVM deletes
      // the account entirely.
      await stateManager.deleteAccount(address)
    } else {
      await stateManager.modifyAccountFields(address, {
        balance,
        nonce,
      })
      for (const storage of acc.storageChanges) {
        const value = storage.slotChanges.slice(-1)[0].postValue
        await stateManager.putStorage(
          address,
          setLengthLeft(hexToBytes(storage.slot), 32),
          setLengthLeft(hexToBytes(value), 32),
        )
      }
    }
  }
  if (expectedStateRoot !== undefined) {
    const stateRoot = await stateManager.getStateRoot()
    if (!equalsBytes(expectedStateRoot, stateRoot)) {
      throw EthereumJSErrorWithoutCode(
        `Expected state root ${bytesToHex(expectedStateRoot)} but got ${bytesToHex(stateRoot)}`,
      )
    }
  }
}

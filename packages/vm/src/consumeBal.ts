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
import type { VM } from './vm.ts'

export async function consumeBal(
  vm: VM,
  bal: BALJSONBlockAccessList,
  expectedStateRoot?: Uint8Array,
) {
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
      await vm.stateManager.putCode(address, hexToBytes(code))
    }

    // Read the account after any code update to get the current codeHash
    const existingAccount = await vm.stateManager.getAccount(address)
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
      await vm.stateManager.deleteAccount(address)
    } else {
      await vm.stateManager.modifyAccountFields(address, {
        balance,
        nonce,
      })
      for (const storage of acc.storageChanges) {
        const value = storage.slotChanges.slice(-1)[0].postValue
        await vm.stateManager.putStorage(
          address,
          setLengthLeft(hexToBytes(storage.slot), 32),
          setLengthLeft(hexToBytes(value), 32),
        )
      }
    }
  }
  const stateRoot = await vm.stateManager.getStateRoot()
  if (expectedStateRoot && !equalsBytes(expectedStateRoot, stateRoot)) {
    throw EthereumJSErrorWithoutCode(
      `Expected state root ${bytesToHex(expectedStateRoot)} but got ${bytesToHex(stateRoot)}`,
    )
  }
}

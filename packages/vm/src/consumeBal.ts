import type { MerkleStateManager } from '@ethereumjs/statemanager'
import {
  type BALJSONBlockAccessList,
  EthereumJSErrorWithoutCode,
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
    const balance =
      acc.balanceChanges.slice(-1)[0]?.postBalance &&
      hexToBigInt(acc.balanceChanges.slice(-1)[0]?.postBalance)
    const nonce =
      acc.nonceChanges.slice(-1)[0]?.postNonce &&
      hexToBigInt(acc.nonceChanges.slice(-1)[0]?.postNonce)
    const code = acc.codeChanges.slice(-1)[0]?.newCode ?? undefined
    if (code !== undefined) {
      await vm.stateManager.putCode(createAddressFromString(acc.address), hexToBytes(code))
    }
    await vm.stateManager.modifyAccountFields(createAddressFromString(acc.address), {
      balance,
      nonce,
    })
    for (const storage of acc.storageChanges) {
      const value = storage.slotChanges.slice(-1)[0].postValue
      await vm.stateManager.putStorage(
        createAddressFromString(acc.address),
        setLengthLeft(hexToBytes(storage.slot), 32),
        setLengthLeft(hexToBytes(value), 32),
      )
    }
    await (vm.stateManager as MerkleStateManager).flush()
  }
  const stateRoot = await vm.stateManager.getStateRoot()
  if (expectedStateRoot && !equalsBytes(expectedStateRoot, stateRoot)) {
    throw EthereumJSErrorWithoutCode(
      `Expected state root ${bytesToHex(expectedStateRoot)} but got ${bytesToHex(stateRoot)}`,
    )
  }
}

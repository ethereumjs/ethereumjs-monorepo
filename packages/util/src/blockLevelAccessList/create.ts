import { RLP, hexToBytes } from '@ethereumjs/rlp'
import { BlockLevelAccessList } from '../bal.ts'
import { bytesToHex, bytesToInt } from '../bytes.ts'
import { normalizeStorageKeyHex, padToEvenHex } from './normalize.ts'
import type { BALAddressHex, BALBalanceHex, BALJSONBlockAccessList, BALNonceHex } from './types.ts'

export function createBlockLevelAccessList(): BlockLevelAccessList {
  return new BlockLevelAccessList()
}

export function createBlockLevelAccessListFromJSON(
  json: BALJSONBlockAccessList,
): BlockLevelAccessList {
  const bal = new BlockLevelAccessList()

  for (const account of json) {
    bal.addAddress(account.address)
    const access = bal.accesses[account.address]

    for (const slotChange of account.storageChanges) {
      const normalizedSlot = normalizeStorageKeyHex(slotChange.slot)
      if (access.storageChanges[normalizedSlot] === undefined) {
        access.storageChanges[normalizedSlot] = []
      }
      for (const change of slotChange.slotChanges) {
        access.storageChanges[normalizedSlot].push([
          parseInt(change.blockAccessIndex, 16),
          hexToBytes(change.postValue),
        ])
      }
    }

    for (const slot of account.storageReads) {
      access.storageReads.add(normalizeStorageKeyHex(slot))
    }

    for (const change of account.balanceChanges) {
      access.balanceChanges.set(
        parseInt(change.blockAccessIndex, 16),
        padToEvenHex(change.postBalance),
      )
    }

    for (const change of account.nonceChanges) {
      access.nonceChanges.set(parseInt(change.blockAccessIndex, 16), padToEvenHex(change.postNonce))
    }

    for (const change of account.codeChanges) {
      access.codeChanges.push([parseInt(change.blockAccessIndex, 16), hexToBytes(change.newCode)])
    }
  }

  return bal
}

export function createBlockLevelAccessListFromRLP(rlp: Uint8Array): BlockLevelAccessList {
  const decoded = RLP.decode(rlp) as Array<
    [
      Uint8Array, // address
      Array<[Uint8Array, Array<[Uint8Array, Uint8Array]>]>, // storage changes
      Uint8Array[], // storage reads
      Array<[Uint8Array, Uint8Array]>, // balance changes
      Array<[Uint8Array, Uint8Array]>, // nonce changes
      Array<[Uint8Array, Uint8Array]>, // code changes
    ]
  >

  const bal = new BlockLevelAccessList()

  for (const account of decoded) {
    const [
      addressBytes,
      storageChangesRaw,
      storageReadsRaw,
      balanceChangesRaw,
      nonceChangesRaw,
      codeChangesRaw,
    ] = account
    const address = bytesToHex(addressBytes) as BALAddressHex
    bal.addAddress(address)
    const access = bal.accesses[address]

    for (const [slotBytes, slotChangesRaw] of storageChangesRaw) {
      const slot = normalizeStorageKeyHex(bytesToHex(slotBytes))
      if (access.storageChanges[slot] === undefined) {
        access.storageChanges[slot] = []
      }
      for (const [indexBytes, valueBytes] of slotChangesRaw) {
        access.storageChanges[slot].push([bytesToInt(indexBytes), valueBytes])
      }
    }

    for (const slotBytes of storageReadsRaw) {
      access.storageReads.add(normalizeStorageKeyHex(bytesToHex(slotBytes)))
    }

    for (const [indexBytes, balanceBytes] of balanceChangesRaw) {
      access.balanceChanges.set(
        bytesToInt(indexBytes),
        padToEvenHex(bytesToHex(balanceBytes)) as BALBalanceHex,
      )
    }

    for (const [indexBytes, nonceBytes] of nonceChangesRaw) {
      access.nonceChanges.set(
        bytesToInt(indexBytes),
        padToEvenHex(bytesToHex(nonceBytes)) as BALNonceHex,
      )
    }

    for (const [indexBytes, codeBytes] of codeChangesRaw) {
      access.codeChanges.push([bytesToInt(indexBytes), codeBytes])
    }
  }

  return bal
}

import {
  type BALJSONAccountChanges,
  type BALJSONBlockAccessList,
  EthereumJSErrorWithoutCode,
  KECCAK256_NULL,
  type PrefixedHexString,
  bytesToHex,
  createAddressFromString,
  equalsBytes,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'

import type { ConsumeBALOptions, StateManagerInterface } from '@ethereumjs/common'

export type { ConsumeBALOptions } from '@ethereumjs/common'

const MERGED_BAL_ACCESS_INDEX = '0x00' as PrefixedHexString

type MergeAcc = {
  address: PrefixedHexString
  balance?: PrefixedHexString
  nonce?: PrefixedHexString
  code?: PrefixedHexString
  slots: Map<string, PrefixedHexString>
  reads: Set<string>
}

function mergeRowTriggersEip161Empty(acc: MergeAcc, row: BALJSONAccountChanges): boolean {
  if (row.balanceChanges.length === 0 && row.nonceChanges.length === 0) return false
  if (acc.balance === undefined || hexToBigInt(acc.balance) !== 0n) return false
  if (acc.nonce === undefined || hexToBigInt(acc.nonce) !== 0n) return false
  const hasCode = acc.code !== undefined && acc.code !== '0x' && acc.code.length > 2
  return !hasCode && row.storageChanges.length === 0
}

/**
 * Compact an ordered slice of EIP-7928 block access lists into one JSON list
 * whose single {@link consumeBAL} application matches sequential application.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function mergeBALs(accessLists: BALJSONBlockAccessList[]): BALJSONBlockAccessList {
  const byAddr = new Map<string, MergeAcc>()

  for (const list of accessLists) {
    for (const row of list) {
      const key = row.address.toLowerCase()
      let acc = byAddr.get(key)
      if (acc === undefined) {
        acc = { address: row.address, slots: new Map(), reads: new Set() }
        byAddr.set(key, acc)
      }
      acc.address = row.address

      const lastBal = row.balanceChanges.at(-1)
      if (lastBal !== undefined) acc.balance = lastBal.postBalance
      const lastNonce = row.nonceChanges.at(-1)
      if (lastNonce !== undefined) acc.nonce = lastNonce.postNonce
      const lastCode = row.codeChanges.at(-1)
      if (lastCode !== undefined) acc.code = lastCode.newCode

      for (const sc of row.storageChanges) {
        const last = sc.slotChanges.at(-1)
        if (last !== undefined) acc.slots.set(sc.slot.toLowerCase(), last.postValue)
      }
      for (const r of row.storageReads) {
        acc.reads.add(r.toLowerCase())
      }

      if (mergeRowTriggersEip161Empty(acc, row)) {
        acc.slots.clear()
        acc.reads.clear()
      }
    }
  }

  const out: BALJSONBlockAccessList = []
  for (const acc of byAddr.values()) {
    const entry: BALJSONAccountChanges = {
      address: acc.address,
      balanceChanges:
        acc.balance !== undefined
          ? [{ blockAccessIndex: MERGED_BAL_ACCESS_INDEX, postBalance: acc.balance }]
          : [],
      nonceChanges:
        acc.nonce !== undefined
          ? [{ blockAccessIndex: MERGED_BAL_ACCESS_INDEX, postNonce: acc.nonce }]
          : [],
      codeChanges:
        acc.code !== undefined
          ? [{ blockAccessIndex: MERGED_BAL_ACCESS_INDEX, newCode: acc.code }]
          : [],
      storageChanges: [...acc.slots.entries()].map(([slot, postValue]) => ({
        slot: slot as PrefixedHexString,
        slotChanges: [{ blockAccessIndex: MERGED_BAL_ACCESS_INDEX, postValue }],
      })),
      storageReads: [...acc.reads] as PrefixedHexString[],
    }
    if (
      entry.balanceChanges.length === 0 &&
      entry.nonceChanges.length === 0 &&
      entry.codeChanges.length === 0 &&
      entry.storageChanges.length === 0
    ) {
      continue
    }
    out.push(entry)
  }
  return out
}

/**
 * Apply multiple consecutive block access lists in one state pass via {@link mergeBALs}.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export async function consumeBALBatch(
  stateManager: StateManagerInterface,
  accessLists: BALJSONBlockAccessList[],
  optsOrExpectedStateRoot?: Uint8Array | ConsumeBALOptions,
): Promise<void> {
  if (accessLists.length === 0) return
  if (accessLists.length === 1) {
    await consumeBAL(stateManager, accessLists[0]!, optsOrExpectedStateRoot)
    return
  }
  const merged = mergeBALs(accessLists)
  await consumeBAL(stateManager, merged, optsOrExpectedStateRoot)
}

function normalizeConsumeBALOpts(
  optsOrExpectedStateRoot?: Uint8Array | ConsumeBALOptions,
): ConsumeBALOptions {
  if (optsOrExpectedStateRoot === undefined) return {}
  if (optsOrExpectedStateRoot instanceof Uint8Array) {
    return { expectedStateRoot: optsOrExpectedStateRoot }
  }
  return optsOrExpectedStateRoot
}

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
  optsOrExpectedStateRoot?: Uint8Array | ConsumeBALOptions,
): Promise<void> {
  const opts = normalizeConsumeBALOpts(optsOrExpectedStateRoot)
  const { expectedStateRoot, shouldApplyAccount } = opts
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
    if (shouldApplyAccount !== undefined && !shouldApplyAccount(address)) {
      continue
    }
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

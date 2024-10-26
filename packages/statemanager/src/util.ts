import { VerkleAccessedStateType } from '@ethereumjs/common'
import { Account, bytesToHex } from '@ethereumjs/util'

import type { AccountFields, StateManagerInterface } from '@ethereumjs/common'
import type { Address, PrefixedHexString } from '@ethereumjs/util'

/**
 * Helper method for decoding verkle accessWitness values
 * @param type the type of the accessed state
 * @param value the value of the accessed state
 * @returns string - the decoded value of the accessed state
 */
export function decodeVerkleAccessWitnessValue(
  type: VerkleAccessedStateType,
  value: PrefixedHexString | null,
): string {
  if (value === null) {
    return ''
  }

  switch (type) {
    case VerkleAccessedStateType.BasicData:
    case VerkleAccessedStateType.CodeHash:
    case VerkleAccessedStateType.Code:
    case VerkleAccessedStateType.Storage: {
      return value
    }
  }
}

export async function modifyAccountFields(
  stateManager: StateManagerInterface,
  address: Address,
  accountFields: AccountFields,
): Promise<void> {
  const account = (await stateManager.getAccount(address)) ?? new Account()

  account.nonce = accountFields.nonce ?? account.nonce
  account.balance = accountFields.balance ?? account.balance
  account.storageRoot = accountFields.storageRoot ?? account.storageRoot
  account.codeHash = accountFields.codeHash ?? account.codeHash
  account.codeSize = accountFields.codeSize ?? account.codeSize
  // @ts-ignore
  if (stateManager['_debug'] !== undefined) {
    for (const [field, value] of Object.entries(accountFields)) {
      //@ts-ignore
      stateManager['_debug'](
        `modifyAccountFields address=${address.toString()} ${field}=${value instanceof Uint8Array ? bytesToHex(value) : value} `,
      )
    }
  }
  await stateManager.putAccount(address, account)
}

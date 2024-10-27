import { Account, bytesToHex } from '@ethereumjs/util'

import type { AccountFields, StateManagerInterface } from '@ethereumjs/common'
import type { Address } from '@ethereumjs/util'

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

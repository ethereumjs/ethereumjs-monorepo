import {
  bigIntToHex,
  bytesToHex,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
  unpadBytes,
} from '@ethereumjs/util'

import type { Account, Address, PrefixedHexString } from '@ethereumjs/util'
import type { VM } from '../../src/vm.ts'
import type { T8NAlloc } from './types.ts'

export class StateTracker {
  private allocTracker: {
    // TODO these are all PrefixedHexString
    [address: string]: {
      storage: string[]
    }
  } = {}

  private alloc: T8NAlloc

  private vm: VM

  constructor(vm: VM, alloc: T8NAlloc) {
    this.alloc = alloc
    const originalPutAccount = vm.stateManager.putAccount
    const originalPutCode = vm.stateManager.putCode
    const originalPutStorage = vm.stateManager.putStorage

    this.vm = vm
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    vm.stateManager.putAccount = async function (...args: [Address, Account?]) {
      const address = args[0]
      self['addAddress'](address.toString())
      await originalPutAccount.apply(this, args)
    }

    vm.stateManager.putCode = async function (...args: [Address, Uint8Array]) {
      const address = args[0]
      self['addAddress'](address.toString())
      return originalPutCode.apply(this, args)
    }

    vm.stateManager.putStorage = async function (...args: [Address, Uint8Array, Uint8Array]) {
      const address = args[0]
      const key = args[1]
      self['addStorage'](address.toString(), bytesToHex(key))
      return originalPutStorage.apply(this, args)
    }
  }

  private addAddress(address: PrefixedHexString) {
    if (this.allocTracker[address] === undefined) {
      this.allocTracker[address] = { storage: [] }
    }
    return this.allocTracker[address]
  }

  private addStorage(address: PrefixedHexString, storage: PrefixedHexString) {
    const storageList = this.addAddress(address).storage
    if (!storageList.includes(storage)) {
      storageList.push(storage)
    }
  }

  public async dumpAlloc() {
    // Build output alloc
    const outputAlloc = this.alloc
    for (const addressString in this.allocTracker) {
      const address = createAddressFromString(addressString)
      const account = await this.vm.stateManager.getAccount(address)
      if (account === undefined) {
        delete outputAlloc[addressString]
        continue
      }
      if (outputAlloc[addressString] === undefined) {
        outputAlloc[addressString] = {
          balance: '0x0',
        }
      }
      outputAlloc[addressString].nonce = bigIntToHex(account.nonce)
      outputAlloc[addressString].balance = bigIntToHex(account.balance)
      outputAlloc[addressString].code = bytesToHex(await this.vm.stateManager.getCode(address))

      const storage = this.allocTracker[addressString].storage as PrefixedHexString[]
      outputAlloc[addressString].storage = outputAlloc[addressString].storage ?? {}

      for (const key of storage) {
        const keyBytes = hexToBytes(key)
        let storageKeyTrimmed = bytesToHex(unpadBytes(keyBytes))
        if (storageKeyTrimmed === '0x') {
          storageKeyTrimmed = '0x00'
        }
        const value = await this.vm.stateManager.getStorage(address, setLengthLeft(keyBytes, 32))
        if (value.length === 0) {
          delete outputAlloc[addressString].storage![storageKeyTrimmed]
          // To be sure, also delete any keys which are left-padded to 32 bytes
          delete outputAlloc[addressString].storage![key]
          continue
        }
        outputAlloc[addressString].storage![storageKeyTrimmed] = bytesToHex(value)
      }
    }
    return outputAlloc
  }
}

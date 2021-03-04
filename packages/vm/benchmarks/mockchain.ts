import { BN } from 'ethereumjs-util'

// Mockchain: only used to provide blockhashes for the BLOCKHASH opcode for the VM. Has no other uses.
export default class Mockchain {
  _hashes: any

  constructor() {
    this._hashes = {}
  }

  getBlock(num: BN): any {
    const bhash = this._hashes[num.toString()]
    return {
      hash() {
        return bhash
      },
    }
  }

  putBlockHash(num: BN, hash: Buffer): void {
    this._hashes[num.toString()] = hash
  }
}

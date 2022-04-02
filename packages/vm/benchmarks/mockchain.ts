// Mockchain: only used to provide blockhashes for the BLOCKHASH opcode for the VM. Has no other uses.
export default class Mockchain {
  _hashes: any

  constructor() {
    this._hashes = {}
  }

  async _init() {}

  getBlock(num: bigint): any {
    const bhash = this._hashes[num.toString()]
    return {
      hash() {
        return bhash
      },
    }
  }

  putBlockHash(num: bigint, hash: Buffer): void {
    this._hashes[num.toString()] = hash
  }
}

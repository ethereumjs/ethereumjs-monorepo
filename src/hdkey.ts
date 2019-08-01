import Wallet from './index'

const HDKey = require('hdkey')

export default class EthereumHDKey {
  public static fromMasterSeed(seedBuffer: Buffer): EthereumHDKey {
    return new EthereumHDKey(HDKey.fromMasterSeed(seedBuffer))
  }

  public static fromExtendedKey(base58Key: string): EthereumHDKey {
    return new EthereumHDKey(HDKey.fromExtendedKey(base58Key))
  }

  constructor(private readonly _hdkey?: any) {}

  public privateExtendedKey(): Buffer {
    if (!this._hdkey.privateExtendedKey) {
      throw new Error('This is a public key only wallet')
    }
    return this._hdkey.privateExtendedKey
  }

  public publicExtendedKey(): Buffer {
    return this._hdkey.publicExtendedKey
  }

  public derivePath(path: string): EthereumHDKey {
    return new EthereumHDKey(this._hdkey.derive(path))
  }

  public deriveChild(index: number): EthereumHDKey {
    return new EthereumHDKey(this._hdkey.deriveChild(index))
  }

  public getWallet(): Wallet {
    if (this._hdkey._privateKey) {
      return Wallet.fromPrivateKey(this._hdkey._privateKey)
    }
    return Wallet.fromPublicKey(this._hdkey._publicKey, true)
  }
}

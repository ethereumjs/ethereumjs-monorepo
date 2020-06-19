import Wallet from './index'

import { HDKey } from 'ethereum-cryptography/hdkey'

export default class EthereumHDKey {
  /**
   * Creates an instance based on a seed.
   *
   * For the seed we suggest to use [bip39](https://npmjs.org/package/bip39) to
   * create one from a BIP39 mnemonic.
   */
  public static fromMasterSeed(seedBuffer: Buffer): EthereumHDKey {
    return new EthereumHDKey(HDKey.fromMasterSeed(seedBuffer))
  }

  /**
   * Create an instance based on a BIP32 extended private or public key.
   */
  public static fromExtendedKey(base58Key: string): EthereumHDKey {
    return new EthereumHDKey(HDKey.fromExtendedKey(base58Key))
  }

  constructor(private readonly _hdkey?: any) {}

  /**
   * Returns a BIP32 extended private key (xprv)
   */
  public privateExtendedKey(): Buffer {
    if (!this._hdkey.privateExtendedKey) {
      throw new Error('This is a public key only wallet')
    }
    return this._hdkey.privateExtendedKey
  }

  /**
   * Return a BIP32 extended public key (xpub)
   */
  public publicExtendedKey(): Buffer {
    return this._hdkey.publicExtendedKey
  }

  /**
   * Derives a node based on a path (e.g. m/44'/0'/0/1)
   */
  public derivePath(path: string): EthereumHDKey {
    return new EthereumHDKey(this._hdkey.derive(path))
  }

  /**
   * Derive a node based on a child index
   */
  public deriveChild(index: number): EthereumHDKey {
    return new EthereumHDKey(this._hdkey.deriveChild(index))
  }

  /**
   * Return a `Wallet` instance as seen above
   */
  public getWallet(): Wallet {
    if (this._hdkey._privateKey) {
      return Wallet.fromPrivateKey(this._hdkey._privateKey)
    }
    return Wallet.fromPublicKey(this._hdkey._publicKey, true)
  }
}

# ethereumjs-wallet

## Index

### Classes

- [EthereumHDKey](classes/ethereumhdkey.md)
- [Wallet](classes/wallet.md)
- [WalletSubprovider](classes/walletsubprovider.md)

### Interfaces

- [EtherWalletOptions](interfaces/etherwalletoptions.md)
- [EvpKdfOpts](interfaces/evpkdfopts.md)

### Functions

- [fromEtherCamp](#fromethercamp)
- [fromEtherWallet](#frometherwallet)
- [fromKryptoKit](#fromkryptokit)
- [fromQuorumWallet](#fromquorumwallet)

---

## Functions

<a id="fromethercamp"></a>

### fromEtherCamp

▸ **fromEtherCamp**(passphrase: _`string`_): [Wallet](classes/wallet.md)

_Defined in [thirdparty.ts:165](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/thirdparty.ts#L165)_

**Parameters:**

| Name       | Type     |
| ---------- | -------- |
| passphrase | `string` |

**Returns:** [Wallet](classes/wallet.md)

---

<a id="frometherwallet"></a>

### fromEtherWallet

▸ **fromEtherWallet**(input: _`string` \| [EtherWalletOptions](interfaces/etherwalletoptions.md)_, password: _`string`_): [Wallet](classes/wallet.md)

_Defined in [thirdparty.ts:120](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/thirdparty.ts#L120)_

**Parameters:**

| Name     | Type                                                               |
| -------- | ------------------------------------------------------------------ |
| input    | `string` \| [EtherWalletOptions](interfaces/etherwalletoptions.md) |
| password | `string`                                                           |

**Returns:** [Wallet](classes/wallet.md)

---

<a id="fromkryptokit"></a>

### fromKryptoKit

▸ **fromKryptoKit**(entropy: _`string`_, password: _`string`_): [Wallet](classes/wallet.md)

_Defined in [thirdparty.ts:169](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/thirdparty.ts#L169)_

**Parameters:**

| Name     | Type     |
| -------- | -------- |
| entropy  | `string` |
| password | `string` |

**Returns:** [Wallet](classes/wallet.md)

---

<a id="fromquorumwallet"></a>

### fromQuorumWallet

▸ **fromQuorumWallet**(passphrase: _`string`_, userid: _`string`_): [Wallet](classes/wallet.md)

_Defined in [thirdparty.ts:255](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/thirdparty.ts#L255)_

**Parameters:**

| Name       | Type     |
| ---------- | -------- |
| passphrase | `string` |
| userid     | `string` |

**Returns:** [Wallet](classes/wallet.md)

---

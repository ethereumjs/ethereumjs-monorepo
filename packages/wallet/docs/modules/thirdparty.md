[@ethereumjs/wallet](../README.md) / thirdparty

# Namespace: thirdparty

## Table of contents

### Interfaces

- [EtherWalletOptions](../interfaces/thirdparty.EtherWalletOptions.md)
- [EvpKdfOpts](../interfaces/thirdparty.EvpKdfOpts.md)

### Variables

- [Thirdparty](thirdparty.md#thirdparty)

### Functions

- [fromEtherCamp](thirdparty.md#fromethercamp)
- [fromEtherWallet](thirdparty.md#frometherwallet)
- [fromQuorumWallet](thirdparty.md#fromquorumwallet)

## Variables

### Thirdparty

• `Const` **Thirdparty**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromEtherCamp` | (`passphrase`: `string`) => [`Wallet`](../classes/Wallet.md) |
| `fromEtherWallet` | (`input`: `string` \| [`EtherWalletOptions`](../interfaces/thirdparty.EtherWalletOptions.md), `password`: `string`) => `Promise`<[`Wallet`](../classes/Wallet.md)\> |
| `fromQuorumWallet` | (`passphrase`: `string`, `userid`: `string`) => [`Wallet`](../classes/Wallet.md) |

#### Defined in

[thirdparty.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/thirdparty.ts#L187)

## Functions

### fromEtherCamp

▸ **fromEtherCamp**(`passphrase`): [`Wallet`](../classes/Wallet.md)

Third Party API: Import a brain wallet used by Ether.Camp

#### Parameters

| Name | Type |
| :------ | :------ |
| `passphrase` | `string` |

#### Returns

[`Wallet`](../classes/Wallet.md)

#### Defined in

[thirdparty.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/thirdparty.ts#L167)

___

### fromEtherWallet

▸ **fromEtherWallet**(`input`, `password`): `Promise`<[`Wallet`](../classes/Wallet.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` \| [`EtherWalletOptions`](../interfaces/thirdparty.EtherWalletOptions.md) |
| `password` | `string` |

#### Returns

`Promise`<[`Wallet`](../classes/Wallet.md)\>

#### Defined in

[thirdparty.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/thirdparty.ts#L118)

___

### fromQuorumWallet

▸ **fromQuorumWallet**(`passphrase`, `userid`): [`Wallet`](../classes/Wallet.md)

Third Party API: Import a brain wallet used by Quorum Wallet

#### Parameters

| Name | Type |
| :------ | :------ |
| `passphrase` | `string` |
| `userid` | `string` |

#### Returns

[`Wallet`](../classes/Wallet.md)

#### Defined in

[thirdparty.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/thirdparty.ts#L174)

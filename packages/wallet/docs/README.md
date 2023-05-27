@ethereumjs/wallet

# @ethereumjs/wallet

## Table of contents

### Classes

- [Wallet](classes/Wallet.md)
- [hdkey](classes/hdkey.md)

### Variables

- [thirdparty](README.md#thirdparty)

## Variables

### thirdparty

• `Const` **thirdparty**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromEtherCamp` | (`passphrase`: `string`) => [`Wallet`](classes/Wallet.md) |
| `fromEtherWallet` | (`input`: `string` \| `EtherWalletOptions`, `password`: `string`) => `Promise`<[`Wallet`](classes/Wallet.md)\> |
| `fromQuorumWallet` | (`passphrase`: `string`, `userid`: `string`) => [`Wallet`](classes/Wallet.md) |

#### Defined in

[thirdparty.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/thirdparty.ts#L187)

[**@ethereumjs/wallet**](../../../../README.md)

***

[@ethereumjs/wallet](../../../../README.md) / [thirdparty](../README.md) / Thirdparty

# Variable: Thirdparty

> `const` **Thirdparty**: `object`

Defined in: [thirdparty.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/thirdparty.ts#L195)

## Type Declaration

### fromEtherCamp()

> **fromEtherCamp**: (`passphrase`) => [`Wallet`](../../../../classes/Wallet.md)

Third Party API: Import a brain wallet used by Ether.Camp

#### Parameters

##### passphrase

`string`

#### Returns

[`Wallet`](../../../../classes/Wallet.md)

### fromEtherWallet()

> **fromEtherWallet**: (`input`, `password`) => `Promise`\<[`Wallet`](../../../../classes/Wallet.md)\>

#### Parameters

##### input

`string` | [`EtherWalletOptions`](../interfaces/EtherWalletOptions.md)

##### password

`string`

#### Returns

`Promise`\<[`Wallet`](../../../../classes/Wallet.md)\>

### fromQuorumWallet()

> **fromQuorumWallet**: (`passphrase`, `userid`) => [`Wallet`](../../../../classes/Wallet.md)

Third Party API: Import a brain wallet used by Quorum Wallet

#### Parameters

##### passphrase

`string`

##### userid

`string`

#### Returns

[`Wallet`](../../../../classes/Wallet.md)

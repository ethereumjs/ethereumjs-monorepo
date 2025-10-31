[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / Capability

# Variable: Capability

> **Capability**: `object`

Defined in: [types.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L18)

Can be used in conjunction with [\[TransactionType\].supports](../interfaces/Transaction.md)
to query on tx capabilities

## Type Declaration

### EIP1559FeeMarket

> **EIP1559FeeMarket**: `number` = `1559`

Tx supports EIP-1559 gas fee market mechanism
See: [1559](https://eips.ethereum.org/EIPS/eip-1559) Fee Market EIP

### EIP155ReplayProtection

> **EIP155ReplayProtection**: `number` = `155`

Tx supports EIP-155 replay protection
See: [155](https://eips.ethereum.org/EIPS/eip-155) Replay Attack Protection EIP

### EIP2718TypedTransaction

> **EIP2718TypedTransaction**: `number` = `2718`

Tx is a typed transaction as defined in EIP-2718
See: [2718](https://eips.ethereum.org/EIPS/eip-2718) Transaction Type EIP

### EIP2930AccessLists

> **EIP2930AccessLists**: `number` = `2930`

Tx supports access list generation as defined in EIP-2930
See: [2930](https://eips.ethereum.org/EIPS/eip-2930) Access Lists EIP

### EIP7702EOACode

> **EIP7702EOACode**: `number` = `7702`

Tx supports setting EOA code
See [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702)

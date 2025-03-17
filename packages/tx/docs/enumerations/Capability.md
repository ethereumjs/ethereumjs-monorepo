[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / Capability

# Enumeration: Capability

Defined in: [types.ts:20](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L20)

Can be used in conjunction with [\[TransactionType\].supports](../interfaces/Transaction.md)
to query on tx capabilities

## Enumeration Members

### EIP1559FeeMarket

> **EIP1559FeeMarket**: `1559`

Defined in: [types.ts:31](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L31)

Tx supports EIP-1559 gas fee market mechanism
See: [1559](https://eips.ethereum.org/EIPS/eip-1559) Fee Market EIP

***

### EIP155ReplayProtection

> **EIP155ReplayProtection**: `155`

Defined in: [types.ts:25](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L25)

Tx supports EIP-155 replay protection
See: [155](https://eips.ethereum.org/EIPS/eip-155) Replay Attack Protection EIP

***

### EIP2718TypedTransaction

> **EIP2718TypedTransaction**: `2718`

Defined in: [types.ts:37](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L37)

Tx is a typed transaction as defined in EIP-2718
See: [2718](https://eips.ethereum.org/EIPS/eip-2718) Transaction Type EIP

***

### EIP2930AccessLists

> **EIP2930AccessLists**: `2930`

Defined in: [types.ts:43](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L43)

Tx supports access list generation as defined in EIP-2930
See: [2930](https://eips.ethereum.org/EIPS/eip-2930) Access Lists EIP

***

### EIP7702EOACode

> **EIP7702EOACode**: `7702`

Defined in: [types.ts:49](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L49)

Tx supports setting EOA code
See [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702)

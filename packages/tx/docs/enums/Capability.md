[@ethereumjs/tx](../README.md) / Capability

# Enumeration: Capability

Can be used in conjunction with [supports](../classes/Transaction.md#supports)
to query on tx capabilities

## Table of contents

### Enumeration Members

- [EIP1559FeeMarket](Capability.md#eip1559feemarket)
- [EIP155ReplayProtection](Capability.md#eip155replayprotection)
- [EIP2718TypedTransaction](Capability.md#eip2718typedtransaction)
- [EIP2930AccessLists](Capability.md#eip2930accesslists)

## Enumeration Members

### EIP1559FeeMarket

• **EIP1559FeeMarket** = ``1559``

Tx supports EIP-1559 gas fee market mechanism
See: [1559](https://eips.ethereum.org/EIPS/eip-1559) Fee Market EIP

#### Defined in

[types.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L51)

___

### EIP155ReplayProtection

• **EIP155ReplayProtection** = ``155``

Tx supports EIP-155 replay protection
See: [155](https://eips.ethereum.org/EIPS/eip-155) Replay Attack Protection EIP

#### Defined in

[types.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L45)

___

### EIP2718TypedTransaction

• **EIP2718TypedTransaction** = ``2718``

Tx is a typed transaction as defined in EIP-2718
See: [2718](https://eips.ethereum.org/EIPS/eip-2718) Transaction Type EIP

#### Defined in

[types.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L57)

___

### EIP2930AccessLists

• **EIP2930AccessLists** = ``2930``

Tx supports access list generation as defined in EIP-2930
See: [2930](https://eips.ethereum.org/EIPS/eip-2930) Access Lists EIP

#### Defined in

[types.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L63)

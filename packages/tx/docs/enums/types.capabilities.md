[@ethereumjs/tx](../README.md) / [types](../modules/types.md) / Capabilities

# Enumeration: Capabilities

[types](../modules/types.md).Capabilities

Can be used in conjunction with {@link Transaction.supports}
to query on tx capabilities

## Table of contents

### Enumeration members

- [EIP1559FeeMarket](types.capabilities.md#eip1559feemarket)
- [EIP155ReplayProtection](types.capabilities.md#eip155replayprotection)
- [EIP2718TypedTransaction](types.capabilities.md#eip2718typedtransaction)
- [EIP2930AccessLists](types.capabilities.md#eip2930accesslists)

## Enumeration members

### EIP1559FeeMarket

• **EIP1559FeeMarket** = 1559

Tx supports EIP-1559 gas fee market mechansim
See: [1559](https://eips.ethereum.org/EIPS/eip-1559) Fee Market EIP

#### Defined in

[types.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L22)

___

### EIP155ReplayProtection

• **EIP155ReplayProtection** = 155

Tx supports EIP-155 replay protection
See: [155](https://eips.ethereum.org/EIPS/eip-155) Replay Attack Protection EIP

#### Defined in

[types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L16)

___

### EIP2718TypedTransaction

• **EIP2718TypedTransaction** = 2718

Tx is a typed transaction as defined in EIP-2718
See: [2718](https://eips.ethereum.org/EIPS/eip-2718) Transaction Type EIP

#### Defined in

[types.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L28)

___

### EIP2930AccessLists

• **EIP2930AccessLists** = 2930

Tx supports access list generation as defined in EIP-2930
See: [2930](https://eips.ethereum.org/EIPS/eip-2930) Access Lists EIP

#### Defined in

[types.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L34)

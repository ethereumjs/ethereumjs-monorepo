[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / TxGasDimensionsEstimate

# Interface: TxGasDimensionsEstimate

Defined in: [vm/src/estimateTxGasDimensions.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/estimateTxGasDimensions.ts#L18)

Pre-state first-touch gas estimate for wallets / estimators.

Regular gas is `max(intrinsic, calldata floor)` (same as tx validation).
State gas is the EIP-8037 new-account charge for a value-bearing call to an
empty recipient, or for a create whose target is not already alive. It does
**not** simulate execution (SSTORE, inner CREATE, 7702 auth state, …).

## Remarks

Experimental (Amsterdam): may change on patch releases.

## Properties

### estimatedStateGas

> **estimatedStateGas**: `bigint`

Defined in: [vm/src/estimateTxGasDimensions.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/estimateTxGasDimensions.ts#L27)

New-account state gas from current pre-state (0 when EIP-8037 is inactive
or the touched account is already alive).

***

### floor

> **floor**: `bigint`

Defined in: [vm/src/estimateTxGasDimensions.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/estimateTxGasDimensions.ts#L22)

***

### intrinsicRegular

> **intrinsicRegular**: `bigint`

Defined in: [vm/src/estimateTxGasDimensions.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/estimateTxGasDimensions.ts#L21)

***

### minimumGasLimit

> **minimumGasLimit**: `bigint`

Defined in: [vm/src/estimateTxGasDimensions.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/estimateTxGasDimensions.ts#L20)

Tx-level minimum (`max(intrinsic, floor)`); no state dimension.

***

### recommendedGasLimit

> **recommendedGasLimit**: `bigint`

Defined in: [vm/src/estimateTxGasDimensions.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/estimateTxGasDimensions.ts#L29)

`minimumGasLimit + estimatedStateGas` — a sendable `gasLimit` for simple transfers/creates.

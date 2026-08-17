[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / validateBlockAccessListGasLimit

# Function: validateBlockAccessListGasLimit()

> **validateBlockAccessListGasLimit**(`bal`, `blockGasLimit`): `void`

Defined in: [packages/util/src/bal/validation.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/validation.ts#L42)

Ensures `bal_items <= block_gas_limit // ITEM_COST` (EIP-7928).

## Parameters

### bal

[`BlockLevelAccessList`](../classes/BlockLevelAccessList.md)

### blockGasLimit

`bigint`

## Returns

`void`

## Throws

if the access list exceeds the block gas-derived item cap

## Remarks

Experimental (Amsterdam): may change on patch releases.

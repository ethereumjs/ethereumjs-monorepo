[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createAccessList2930TxFromRLP

# Function: createAccessList2930TxFromRLP()

> **createAccessList2930TxFromRLP**(`serialized`, `opts?`): [`AccessList2930Tx`](../classes/AccessList2930Tx.md)

Defined in: [2930/constructors.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/constructors.ts#L82)

Instantiate an EIP-2930 transaction from RLP-serialized bytes.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s])`

## Parameters

### serialized

`Uint8Array`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`AccessList2930Tx`](../classes/AccessList2930Tx.md)

## Throws

If the leading type byte is not `0x01`

## Throws

If RLP decode result is not an array

## Throws

If decoded values fail [createAccessList2930TxFromBytesArray](createAccessList2930TxFromBytesArray.md) checks

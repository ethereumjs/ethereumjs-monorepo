[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / createWithdrawalFromBytesArray

# Function: createWithdrawalFromBytesArray()

> **createWithdrawalFromBytesArray**(`withdrawalArray`): [`Withdrawal`](../classes/Withdrawal.md)

Defined in: [packages/util/src/withdrawal.ts:125](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L125)

Creates a validator withdrawal request to be submitted to the consensus layer from
an RLP list

## Parameters

### withdrawalArray

[`WithdrawalBytes`](../type-aliases/WithdrawalBytes.md)

decoded RLP list of withdrawal data elements

## Returns

[`Withdrawal`](../classes/Withdrawal.md)

a [Withdrawal](../classes/Withdrawal.md) object

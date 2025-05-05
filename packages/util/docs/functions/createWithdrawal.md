[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / createWithdrawal

# Function: createWithdrawal()

> **createWithdrawal**(`withdrawalData`): [`Withdrawal`](../classes/Withdrawal.md)

Defined in: [packages/util/src/withdrawal.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L106)

Creates a validator withdrawal request to be submitted to the consensus layer

## Parameters

### withdrawalData

[`WithdrawalData`](../type-aliases/WithdrawalData.md)

the consensus layer index and validator index values for the
validator requesting the withdrawal and the address and withdrawal amount of the request

## Returns

[`Withdrawal`](../classes/Withdrawal.md)

a [Withdrawal](../classes/Withdrawal.md) object

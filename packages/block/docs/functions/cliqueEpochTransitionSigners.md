[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / cliqueEpochTransitionSigners

# Function: cliqueEpochTransitionSigners()

> **cliqueEpochTransitionSigners**(`header`): `Address`[]

Defined in: [consensus/clique.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/consensus/clique.ts#L86)

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with BlockHeader.cliqueIsEpochTransition

## Parameters

### header

[`BlockHeader`](../classes/BlockHeader.md)

## Returns

`Address`[]

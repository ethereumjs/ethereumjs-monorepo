[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / EIPConfig

# Type Alias: EIPConfig

> **EIPConfig** = `object`

Defined in: [types.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L177)

Minimum hardfork and prerequisite EIPs for activating one EIP.

## Properties

### minimumHardfork

> **minimumHardfork**: [`Hardfork`](Hardfork.md)

Defined in: [types.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L184)

Earliest hardfork where this EIP can be activated in isolation, i.e. the
fork that already provides its prerequisites. This is **not** the hardfork
that schedules the EIP (that list lives on `HardforkConfig.eips`). It is
therefore at least one hardfork before the scheduling fork.

***

### requiredEIPs?

> `optional` **requiredEIPs?**: `number`[]

Defined in: [types.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L185)

[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMPerformanceLogger

# Class: EVMPerformanceLogger

Defined in: [logger.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L60)

Collects opcode and precompile execution timings when profiling is enabled.

## Constructors

### Constructor

> **new EVMPerformanceLogger**(): `EVMPerformanceLogger`

Defined in: [logger.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L66)

#### Returns

`EVMPerformanceLogger`

## Methods

### clear()

> **clear**(): `void`

Defined in: [logger.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L70)

#### Returns

`void`

***

### getLogs()

> **getLogs**(): `object`

Defined in: [logger.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L75)

#### Returns

`object`

##### opcodes

> **opcodes**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

##### precompiles

> **precompiles**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

***

### hasTimer()

> **hasTimer**(): `boolean`

Defined in: [logger.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L113)

#### Returns

`boolean`

***

### pauseTimer()

> **pauseTimer**(): [`Timer`](Timer.md)

Defined in: [logger.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L129)

#### Returns

[`Timer`](Timer.md)

***

### startTimer()

> **startTimer**(`tag`): [`Timer`](Timer.md)

Defined in: [logger.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L119)

#### Parameters

##### tag

`string`

#### Returns

[`Timer`](Timer.md)

***

### stopTimer()

> **stopTimer**(`timer`, `gasUsed`, `targetTimer?`, `staticGas?`, `dynamicGas?`): `void`

Defined in: [logger.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L149)

#### Parameters

##### timer

[`Timer`](Timer.md)

##### gasUsed

`number`

##### targetTimer?

`"precompiles"` \| `"opcodes"`

##### staticGas?

`number`

##### dynamicGas?

`number`

#### Returns

`void`

***

### unpauseTimer()

> **unpauseTimer**(`timer`): `void`

Defined in: [logger.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L140)

#### Parameters

##### timer

[`Timer`](Timer.md)

#### Returns

`void`

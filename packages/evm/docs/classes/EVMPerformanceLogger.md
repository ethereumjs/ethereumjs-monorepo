[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMPerformanceLogger

# Class: EVMPerformanceLogger

Defined in: [logger.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L57)

## Constructors

### Constructor

> **new EVMPerformanceLogger**(): `EVMPerformanceLogger`

Defined in: [logger.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L63)

#### Returns

`EVMPerformanceLogger`

## Methods

### clear()

> **clear**(): `void`

Defined in: [logger.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L67)

#### Returns

`void`

***

### getLogs()

> **getLogs**(): `object`

Defined in: [logger.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L72)

#### Returns

`object`

##### opcodes

> **opcodes**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

##### precompiles

> **precompiles**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

***

### hasTimer()

> **hasTimer**(): `boolean`

Defined in: [logger.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L110)

#### Returns

`boolean`

***

### pauseTimer()

> **pauseTimer**(): [`Timer`](Timer.md)

Defined in: [logger.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L126)

#### Returns

[`Timer`](Timer.md)

***

### startTimer()

> **startTimer**(`tag`): [`Timer`](Timer.md)

Defined in: [logger.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L116)

#### Parameters

##### tag

`string`

#### Returns

[`Timer`](Timer.md)

***

### stopTimer()

> **stopTimer**(`timer`, `gasUsed`, `targetTimer`, `staticGas?`, `dynamicGas?`): `void`

Defined in: [logger.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L146)

#### Parameters

##### timer

[`Timer`](Timer.md)

##### gasUsed

`number`

##### targetTimer

`"precompiles"` | `"opcodes"`

##### staticGas?

`number`

##### dynamicGas?

`number`

#### Returns

`void`

***

### unpauseTimer()

> **unpauseTimer**(`timer`): `void`

Defined in: [logger.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/logger.ts#L137)

#### Parameters

##### timer

[`Timer`](Timer.md)

#### Returns

`void`

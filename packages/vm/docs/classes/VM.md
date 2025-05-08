[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / VM

# Class: VM

Defined in: [vm/src/vm.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L16)

Execution engine which can be used to run a blockchain, individual
blocks, individual transactions, or snippets of EVM bytecode.

## Constructors

### Constructor

> **new VM**(`opts`): `VM`

Defined in: [vm/src/vm.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L65)

Instantiates a new VM Object.

#### Parameters

##### opts

[`VMOpts`](../interfaces/VMOpts.md) = `{}`

#### Returns

`VM`

#### Deprecated

The direct usage of this constructor is discouraged since
non-finalized async initialization might lead to side effects. Please
use the async [createVM](../functions/createVM.md) constructor instead (same API).

## Properties

### blockchain

> `readonly` **blockchain**: `EVMMockBlockchainInterface`

Defined in: [vm/src/vm.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L25)

The blockchain the VM operates on

***

### common

> `readonly` **common**: `Common`

Defined in: [vm/src/vm.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L27)

***

### events

> `readonly` **events**: `EventEmitter`\<[`VMEvent`](../type-aliases/VMEvent.md)\>

Defined in: [vm/src/vm.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L29)

***

### evm

> `readonly` **evm**: `EVMInterface`

Defined in: [vm/src/vm.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L33)

The EVM used for bytecode execution

***

### stateManager

> `readonly` **stateManager**: `StateManagerInterface`

Defined in: [vm/src/vm.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L20)

The StateManager used by the VM

## Methods

### errorStr()

> **errorStr**(): `string`

Defined in: [vm/src/vm.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L134)

Return a compact error string representation of the object

#### Returns

`string`

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`): `Promise`\<`VM`\>

Defined in: [vm/src/vm.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L109)

Returns a copy of the VM instance.

Note that the returned copy will share the same db as the original for the blockchain and the statemanager.

Associated caches will be deleted and caches will be re-initialized for a more short-term focused
usage, being less memory intense (the statemanager caches will switch to using an ORDERED_MAP cache
data structure more suitable for short-term usage, the trie node LRU cache will not be activated at all).
To fine-tune this behavior (if the shallow-copy-returned object has a longer life span e.g.) you can set
the `downlevelCaches` option to `false`.

#### Parameters

##### downlevelCaches

`boolean` = `true`

Downlevel (so: adopted for short-term usage) associated state caches (default: true)

#### Returns

`Promise`\<`VM`\>

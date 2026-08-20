[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / VM

# Class: VM

Defined in: [vm/src/vm.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L21)

The VM is a state transition machine that executes EVM bytecode and updates the state.
It can be used to execute transactions, blocks, individual transactions, or snippets of EVM bytecode.

A VM can be created with the constructor method:

- [createVM](../functions/createVM.md)

## Constructors

### Constructor

> **new VM**(`opts?`): `VM`

Defined in: [vm/src/vm.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L68)

Instantiates a new VM Object.

#### Parameters

##### opts?

[`VMOpts`](../interfaces/VMOpts.md) = `{}`

#### Returns

`VM`

#### Deprecated

Use [createVM](../functions/createVM.md) instead — async initialization avoids side effects
from partially constructed instances.

## Properties

### blockchain

> `readonly` **blockchain**: `EVMMockBlockchainInterface`

Defined in: [vm/src/vm.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L30)

The blockchain the VM operates on

***

### common

> `readonly` **common**: `Common`

Defined in: [vm/src/vm.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L32)

***

### events

> `readonly` **events**: `EventEmitter`\<[`VMEvent`](../type-aliases/VMEvent.md)\>

Defined in: [vm/src/vm.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L34)

***

### evm

> `readonly` **evm**: `EVMInterface`

Defined in: [vm/src/vm.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L38)

The EVM used for bytecode execution

***

### stateManager

> `readonly` **stateManager**: `StateManagerInterface`

Defined in: [vm/src/vm.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L25)

The StateManager used by the VM

## Methods

### errorStr()

> **errorStr**(): `string`

Defined in: [vm/src/vm.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L135)

Return a compact error string representation of the object

#### Returns

`string`

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches?`): `Promise`\<`VM`\>

Defined in: [vm/src/vm.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L110)

Returns a copy of the VM instance.

Note that the returned copy will share the same db as the original for the blockchain and the statemanager.

Associated caches will be deleted and caches will be re-initialized for a more short-term focused
usage, being less memory intense (the statemanager caches will switch to using an ORDERED_MAP cache
data structure more suitable for short-term usage, the trie node LRU cache will not be activated at all).
To fine-tune this behavior (if the shallow-copy-returned object has a longer life span e.g.) you can set
the `downlevelCaches` option to `false`.

#### Parameters

##### downlevelCaches?

`boolean` = `true`

Downlevel (so: adopted for short-term usage) associated state caches (default: true)

#### Returns

`Promise`\<`VM`\>

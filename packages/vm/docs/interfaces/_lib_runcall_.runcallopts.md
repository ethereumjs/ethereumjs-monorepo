[@ethereumjs/vm](../README.md) › ["lib/runCall"](../modules/_lib_runcall_.md) › [RunCallOpts](_lib_runcall_.runcallopts.md)

# Interface: RunCallOpts

Options for running a call (or create) operation

## Hierarchy

* **RunCallOpts**

## Index

### Properties

* [block](_lib_runcall_.runcallopts.md#optional-block)
* [caller](_lib_runcall_.runcallopts.md#optional-caller)
* [code](_lib_runcall_.runcallopts.md#optional-code)
* [compiled](_lib_runcall_.runcallopts.md#optional-compiled)
* [data](_lib_runcall_.runcallopts.md#optional-data)
* [delegatecall](_lib_runcall_.runcallopts.md#optional-delegatecall)
* [depth](_lib_runcall_.runcallopts.md#optional-depth)
* [gasLimit](_lib_runcall_.runcallopts.md#optional-gaslimit)
* [gasPrice](_lib_runcall_.runcallopts.md#optional-gasprice)
* [origin](_lib_runcall_.runcallopts.md#optional-origin)
* [salt](_lib_runcall_.runcallopts.md#optional-salt)
* [selfdestruct](_lib_runcall_.runcallopts.md#optional-selfdestruct)
* [static](_lib_runcall_.runcallopts.md#optional-static)
* [to](_lib_runcall_.runcallopts.md#optional-to)
* [value](_lib_runcall_.runcallopts.md#optional-value)

## Properties

### `Optional` block

• **block**? : *Block*

*Defined in [lib/runCall.ts:12](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L12)*

___

### `Optional` caller

• **caller**? : *Address*

*Defined in [lib/runCall.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L15)*

___

### `Optional` code

• **code**? : *Buffer*

*Defined in [lib/runCall.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L23)*

This is for CALLCODE where the code to load is different than the code from the to account

___

### `Optional` compiled

• **compiled**? : *undefined | false | true*

*Defined in [lib/runCall.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L25)*

___

### `Optional` data

• **data**? : *Buffer*

*Defined in [lib/runCall.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L19)*

___

### `Optional` delegatecall

• **delegatecall**? : *undefined | false | true*

*Defined in [lib/runCall.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L29)*

___

### `Optional` depth

• **depth**? : *undefined | number*

*Defined in [lib/runCall.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L24)*

___

### `Optional` gasLimit

• **gasLimit**? : *BN*

*Defined in [lib/runCall.ts:16](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L16)*

___

### `Optional` gasPrice

• **gasPrice**? : *BN*

*Defined in [lib/runCall.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L13)*

___

### `Optional` origin

• **origin**? : *Address*

*Defined in [lib/runCall.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L14)*

___

### `Optional` salt

• **salt**? : *Buffer*

*Defined in [lib/runCall.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L27)*

___

### `Optional` selfdestruct

• **selfdestruct**? : *undefined | object*

*Defined in [lib/runCall.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L28)*

___

### `Optional` static

• **static**? : *undefined | false | true*

*Defined in [lib/runCall.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L26)*

___

### `Optional` to

• **to**? : *Address*

*Defined in [lib/runCall.ts:17](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L17)*

___

### `Optional` value

• **value**? : *BN*

*Defined in [lib/runCall.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCall.ts#L18)*

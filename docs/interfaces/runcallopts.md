[ethereumjs-vm](../README.md) > [RunCallOpts](../interfaces/runcallopts.md)

# Interface: RunCallOpts

Options for running a call (or create) operation

## Hierarchy

**RunCallOpts**

## Index

### Properties

* [block](runcallopts.md#block)
* [caller](runcallopts.md#caller)
* [code](runcallopts.md#code)
* [compiled](runcallopts.md#compiled)
* [data](runcallopts.md#data)
* [delegatecall](runcallopts.md#delegatecall)
* [depth](runcallopts.md#depth)
* [gasLimit](runcallopts.md#gaslimit)
* [gasPrice](runcallopts.md#gasprice)
* [origin](runcallopts.md#origin)
* [salt](runcallopts.md#salt)
* [selfdestruct](runcallopts.md#selfdestruct)
* [static](runcallopts.md#static)
* [to](runcallopts.md#to)
* [value](runcallopts.md#value)

---

## Properties

<a id="block"></a>

### `<Optional>` block

**● block**: *`any`*

*Defined in [runCall.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L13)*

___
<a id="caller"></a>

### `<Optional>` caller

**● caller**: *`Buffer`*

*Defined in [runCall.ts:16](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L16)*

___
<a id="code"></a>

### `<Optional>` code

**● code**: *`Buffer`*

*Defined in [runCall.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L24)*

This is for CALLCODE where the code to load is different than the code from the to account

___
<a id="compiled"></a>

### `<Optional>` compiled

**● compiled**: *`undefined` \| `false` \| `true`*

*Defined in [runCall.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L26)*

___
<a id="data"></a>

### `<Optional>` data

**● data**: *`Buffer`*

*Defined in [runCall.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L20)*

___
<a id="delegatecall"></a>

### `<Optional>` delegatecall

**● delegatecall**: *`undefined` \| `false` \| `true`*

*Defined in [runCall.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L30)*

___
<a id="depth"></a>

### `<Optional>` depth

**● depth**: *`undefined` \| `number`*

*Defined in [runCall.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L25)*

___
<a id="gaslimit"></a>

### `<Optional>` gasLimit

**● gasLimit**: *`Buffer`*

*Defined in [runCall.ts:17](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L17)*

___
<a id="gasprice"></a>

### `<Optional>` gasPrice

**● gasPrice**: *`Buffer`*

*Defined in [runCall.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L14)*

___
<a id="origin"></a>

### `<Optional>` origin

**● origin**: *`Buffer`*

*Defined in [runCall.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L15)*

___
<a id="salt"></a>

### `<Optional>` salt

**● salt**: *`Buffer`*

*Defined in [runCall.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L28)*

___
<a id="selfdestruct"></a>

### `<Optional>` selfdestruct

**● selfdestruct**: *`undefined` \| `object`*

*Defined in [runCall.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L29)*

___
<a id="static"></a>

### `<Optional>` static

**● static**: *`undefined` \| `false` \| `true`*

*Defined in [runCall.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L27)*

___
<a id="to"></a>

### `<Optional>` to

**● to**: *`Buffer`*

*Defined in [runCall.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L18)*

___
<a id="value"></a>

### `<Optional>` value

**● value**: *`Buffer`*

*Defined in [runCall.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runCall.ts#L19)*

___


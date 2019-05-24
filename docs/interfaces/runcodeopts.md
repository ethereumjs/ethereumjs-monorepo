[ethereumjs-vm](../README.md) > [RunCodeOpts](../interfaces/runcodeopts.md)

# Interface: RunCodeOpts

Options for the [runCode](../classes/vm.md#runcode) method.

## Hierarchy

**RunCodeOpts**

## Index

### Properties

* [address](runcodeopts.md#address)
* [block](runcodeopts.md#block)
* [caller](runcodeopts.md#caller)
* [code](runcodeopts.md#code)
* [data](runcodeopts.md#data)
* [depth](runcodeopts.md#depth)
* [gasLimit](runcodeopts.md#gaslimit)
* [gasPrice](runcodeopts.md#gasprice)
* [interpreter](runcodeopts.md#interpreter)
* [isStatic](runcodeopts.md#isstatic)
* [message](runcodeopts.md#message)
* [origin](runcodeopts.md#origin)
* [pc](runcodeopts.md#pc)
* [selfdestruct](runcodeopts.md#selfdestruct)
* [storageReader](runcodeopts.md#storagereader)
* [txContext](runcodeopts.md#txcontext)
* [value](runcodeopts.md#value)

---

## Properties

<a id="address"></a>

### `<Optional>` address

**● address**: *`Buffer`*

*Defined in [runCode.ts:65](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L65)*

The address of the account that is executing this code. The address should be a `Buffer` of bytes. Defaults to `0`

___
<a id="block"></a>

### `<Optional>` block

**● block**: *`any`*

*Defined in [runCode.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L29)*

The [`Block`](https://github.com/ethereumjs/ethereumjs-block) the `tx` belongs to. If omitted a blank block will be used

___
<a id="caller"></a>

### `<Optional>` caller

**● caller**: *`Buffer`*

*Defined in [runCode.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L42)*

The address that ran this code. The address should be a `Buffer` of 20bits. Defaults to `0`

___
<a id="code"></a>

### `<Optional>` code

**● code**: *`Buffer`*

*Defined in [runCode.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L46)*

The EVM code to run

___
<a id="data"></a>

### `<Optional>` data

**● data**: *`Buffer`*

*Defined in [runCode.ts:50](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L50)*

The input data

___
<a id="depth"></a>

### `<Optional>` depth

**● depth**: *`undefined` \| `number`*

*Defined in [runCode.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L59)*

___
<a id="gaslimit"></a>

### `<Optional>` gasLimit

**● gasLimit**: *`Buffer`*

*Defined in [runCode.ts:54](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L54)*

Gas limit

___
<a id="gasprice"></a>

### `<Optional>` gasPrice

**● gasPrice**: *`Buffer`*

*Defined in [runCode.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L33)*

___
<a id="interpreter"></a>

### `<Optional>` interpreter

**● interpreter**: *`Interpreter`*

*Defined in [runCode.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L31)*

___
<a id="isstatic"></a>

### `<Optional>` isStatic

**● isStatic**: *`undefined` \| `false` \| `true`*

*Defined in [runCode.ts:60](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L60)*

___
<a id="message"></a>

### `<Optional>` message

**● message**: *`Message`*

*Defined in [runCode.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L38)*

___
<a id="origin"></a>

### `<Optional>` origin

**● origin**: *`Buffer`*

*Defined in [runCode.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L37)*

The address where the call originated from. The address should be a `Buffer` of 20bits. Defaults to `0`

___
<a id="pc"></a>

### `<Optional>` pc

**● pc**: *`undefined` \| `number`*

*Defined in [runCode.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L69)*

The initial program counter. Defaults to `0`

___
<a id="selfdestruct"></a>

### `<Optional>` selfdestruct

**● selfdestruct**: *`undefined` \| `object`*

*Defined in [runCode.ts:61](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L61)*

___
<a id="storagereader"></a>

### `<Optional>` storageReader

**● storageReader**: *`StorageReader`*

*Defined in [runCode.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L30)*

___
<a id="txcontext"></a>

### `<Optional>` txContext

**● txContext**: *`TxContext`*

*Defined in [runCode.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L32)*

___
<a id="value"></a>

### `<Optional>` value

**● value**: *`Buffer`*

*Defined in [runCode.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runCode.ts#L58)*

The value in ether that is being sent to `opt.address`. Defaults to `0`

___


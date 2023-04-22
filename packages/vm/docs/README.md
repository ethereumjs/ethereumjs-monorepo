@ethereumjs/vm

# @ethereumjs/vm

## Table of contents

### Classes

- [EEI](undefined)
- [VM](undefined)

### Interfaces

- [AfterBlockEvent](undefined)
- [AfterTxEvent](undefined)
- [BaseTxReceipt](undefined)
- [BuildBlockOpts](undefined)
- [BuilderOpts](undefined)
- [PostByzantiumTxReceipt](undefined)
- [PreByzantiumTxReceipt](undefined)
- [RunBlockOpts](undefined)
- [RunBlockResult](undefined)
- [RunTxOpts](undefined)
- [RunTxResult](undefined)
- [SealBlockOpts](undefined)
- [VMOpts](undefined)

### Type Aliases

- [TxReceipt](undefined)
- [VMEvents](undefined)

## Classes

### EEI

• **EEI**: Class EEI

#### Defined in

[vm/src/eei/eei.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/eei.ts#L27)

___

### VM

• **VM**: Class VM

#### Defined in

[vm/src/vm.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L33)

## Interfaces

### AfterBlockEvent

• **AfterBlockEvent**: Interface AfterBlockEvent

#### Defined in

[vm/src/types.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L276)

___

### AfterTxEvent

• **AfterTxEvent**: Interface AfterTxEvent

#### Defined in

[vm/src/types.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L364)

___

### BaseTxReceipt

• **BaseTxReceipt**: Interface BaseTxReceipt

#### Defined in

[vm/src/types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L14)

___

### BuildBlockOpts

• **BuildBlockOpts**: Interface BuildBlockOpts

#### Defined in

[vm/src/types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L163)

___

### BuilderOpts

• **BuilderOpts**: Interface BuilderOpts

#### Defined in

[vm/src/types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L147)

___

### PostByzantiumTxReceipt

• **PostByzantiumTxReceipt**: Interface PostByzantiumTxReceipt

#### Defined in

[vm/src/types.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L44)

___

### PreByzantiumTxReceipt

• **PreByzantiumTxReceipt**: Interface PreByzantiumTxReceipt

#### Defined in

[vm/src/types.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L33)

___

### RunBlockOpts

• **RunBlockOpts**: Interface RunBlockOpts

#### Defined in

[vm/src/types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L202)

___

### RunBlockResult

• **RunBlockResult**: Interface RunBlockResult

#### Defined in

[vm/src/types.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L249)

___

### RunTxOpts

• **RunTxOpts**: Interface RunTxOpts

#### Defined in

[vm/src/types.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L284)

___

### RunTxResult

• **RunTxResult**: Interface RunTxResult

#### Defined in

[vm/src/types.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L330)

___

### SealBlockOpts

• **SealBlockOpts**: Interface SealBlockOpts

#### Defined in

[vm/src/types.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L185)

___

### VMOpts

• **VMOpts**: Interface VMOpts

#### Defined in

[vm/src/types.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L61)

## Type Aliases

### TxReceipt

Ƭ **TxReceipt**: PreByzantiumTxReceipt \| PostByzantiumTxReceipt

#### Defined in

[vm/src/types.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L9)

___

### VMEvents

Ƭ **VMEvents**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterBlock` | Method afterBlock |
| `afterTx` | Method afterTx |
| `beforeBlock` | Method beforeBlock |
| `beforeTx` | Method beforeTx |

#### Defined in

[vm/src/types.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L51)

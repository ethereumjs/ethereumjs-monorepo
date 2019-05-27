[ethereumjs-vm](../README.md) > [TxReceipt](../interfaces/txreceipt.md)

# Interface: TxReceipt

Receipt generated for a transaction

## Hierarchy

**TxReceipt**

## Index

### Properties

* [bitvector](txreceipt.md#bitvector)
* [gasUsed](txreceipt.md#gasused)
* [logs](txreceipt.md#logs)
* [status](txreceipt.md#status)

---

## Properties

<a id="bitvector"></a>

###  bitvector

**● bitvector**: *`Buffer`*

*Defined in [runBlock.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/runBlock.ts#L74)*

Bloom bitvector

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`Buffer`*

*Defined in [runBlock.ts:70](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/runBlock.ts#L70)*

Gas used

___
<a id="logs"></a>

###  logs

**● logs**: *`any`[]*

*Defined in [runBlock.ts:78](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/runBlock.ts#L78)*

Logs emitted

___
<a id="status"></a>

###  status

**● status**: *`0` \| `1`*

*Defined in [runBlock.ts:66](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/runBlock.ts#L66)*

Status of transaction, `0` if successful, `1` if an exception occured

___


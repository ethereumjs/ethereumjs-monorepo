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

*Defined in [runBlock.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runBlock.ts#L63)*

Bloom bitvector

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`Buffer`*

*Defined in [runBlock.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runBlock.ts#L59)*

Gas used

___
<a id="logs"></a>

###  logs

**● logs**: *`any`[]*

*Defined in [runBlock.ts:67](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runBlock.ts#L67)*

Logs emitted

___
<a id="status"></a>

###  status

**● status**: *`0` \| `1`*

*Defined in [runBlock.ts:55](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runBlock.ts#L55)*

Status of transaction, `1` if successful, `0` if an exception occured

___


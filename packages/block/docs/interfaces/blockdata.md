[ethereumjs-block](../README.md) > [BlockData](../interfaces/blockdata.md)

# Interface: BlockData

A block's data.

## Hierarchy

**BlockData**

## Index

### Properties

- [header](blockdata.md#header)
- [transactions](blockdata.md#transactions)
- [uncleHeaders](blockdata.md#uncleheaders)

---

## Properties

<a id="header"></a>

### `<Optional>` header

**● header**: _`Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [BlockHeaderData](blockheaderdata.md)_

_Defined in [types.ts:69](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/types.ts#L69)_

---

<a id="transactions"></a>

### `<Optional>` transactions

**● transactions**: _`Array`<`Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| `TxData`>_

_Defined in [types.ts:70](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/types.ts#L70)_

---

<a id="uncleheaders"></a>

### `<Optional>` uncleHeaders

**● uncleHeaders**: _`Array`<`Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [BlockHeaderData](blockheaderdata.md)>_

_Defined in [types.ts:71](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/types.ts#L71)_

---

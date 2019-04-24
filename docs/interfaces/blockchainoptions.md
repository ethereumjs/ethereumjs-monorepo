[ethereumjs-blockchain](../README.md) > [BlockchainOptions](../interfaces/blockchainoptions.md)

# Interface: BlockchainOptions

This are the options that the Blockchain constructor can receive.

## Hierarchy

**BlockchainOptions**

## Index

### Properties

- [blockDb](blockchainoptions.md#blockdb)
- [chain](blockchainoptions.md#chain)
- [common](blockchainoptions.md#common)
- [db](blockchainoptions.md#db)
- [detailsDb](blockchainoptions.md#detailsdb)
- [hardfork](blockchainoptions.md#hardfork)
- [validate](blockchainoptions.md#validate)

---

## Properties

<a id="blockdb"></a>

### `<Optional>` blockDb

**● blockDb**: _`any`_

_Defined in [index.ts:58](https://github.com/ethereumjs/ethereumjs-blockchain/blob/29a8a30/src/index.ts#L58)_

_**deprecated**_:

---

<a id="chain"></a>

### `<Optional>` chain

**● chain**: _`string` \| `number`_

_Defined in [index.ts:30](https://github.com/ethereumjs/ethereumjs-blockchain/blob/29a8a30/src/index.ts#L30)_

The chain id or name. Default: `"mainnet"`.

---

<a id="common"></a>

### `<Optional>` common

**● common**: _`Common`_

_Defined in [index.ts:41](https://github.com/ethereumjs/ethereumjs-blockchain/blob/29a8a30/src/index.ts#L41)_

An alternative way to specify the chain and hardfork is by passing a Common instance.

---

<a id="db"></a>

### `<Optional>` db

**● db**: _`any`_

_Defined in [index.ts:47](https://github.com/ethereumjs/ethereumjs-blockchain/blob/29a8a30/src/index.ts#L47)_

Database to store blocks and metadata. Should be a [levelup](https://github.com/rvagg/node-levelup) instance.

---

<a id="detailsdb"></a>

### `<Optional>` detailsDb

**● detailsDb**: _`any`_

_Defined in [index.ts:63](https://github.com/ethereumjs/ethereumjs-blockchain/blob/29a8a30/src/index.ts#L63)_

_**deprecated**_:

---

<a id="hardfork"></a>

### `<Optional>` hardfork

**● hardfork**: _`string` \| `null`_

_Defined in [index.ts:36](https://github.com/ethereumjs/ethereumjs-blockchain/blob/29a8a30/src/index.ts#L36)_

Hardfork for the blocks. If `undefined` or `null` is passed, it gets computed based on block numbers.

---

<a id="validate"></a>

### `<Optional>` validate

**● validate**: _`undefined` \| `false` \| `true`_

_Defined in [index.ts:53](https://github.com/ethereumjs/ethereumjs-blockchain/blob/29a8a30/src/index.ts#L53)_

This the flag indicates if blocks should be validated (e.g. Proof-of-Work), latest HF rules supported: `Petersburg`.

---

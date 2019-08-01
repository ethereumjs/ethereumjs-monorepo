# ethereumjs-block

## Index

### Classes

- [Block](classes/block.md)
- [BlockHeader](classes/blockheader.md)

### Interfaces

- [BlockData](interfaces/blockdata.md)
- [BlockHeaderData](interfaces/blockheaderdata.md)
- [Blockchain](interfaces/blockchain.md)
- [ChainOptions](interfaces/chainoptions.md)
- [TransformableToBuffer](interfaces/transformabletobuffer.md)

### Type aliases

- [BufferLike](#bufferlike)
- [PrefixedHexString](#prefixedhexstring)

### Functions

- [blockFromRpc](#blockfromrpc)
- [blockHeaderFromRpc](#blockheaderfromrpc)

---

## Type aliases

<a id="bufferlike"></a>

### BufferLike

**Ƭ BufferLike**: _`Buffer` \| [TransformableToBuffer](interfaces/transformabletobuffer.md) \| [PrefixedHexString](#prefixedhexstring) \| `number`_

_Defined in [types.ts:42](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/types.ts#L42)_

A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.

---

<a id="prefixedhexstring"></a>

### PrefixedHexString

**Ƭ PrefixedHexString**: _`string`_

_Defined in [types.ts:37](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/types.ts#L37)_

A hex string prefixed with `0x`.

---

## Functions

<a id="blockfromrpc"></a>

### blockFromRpc

▸ **blockFromRpc**(blockParams: _`any`_, uncles?: _`any`[]_, chainOptions?: _[ChainOptions](interfaces/chainoptions.md)_): [Block](classes/block.md)

_Defined in [from-rpc.ts:14](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/from-rpc.ts#L14)_

Creates a new block object from Ethereum JSON RPC.

**Parameters:**

| Name                    | Type                                       | Description                                                                    |
| ----------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| blockParams             | `any`                                      | Ethereum JSON RPC of block (eth_getBlockByNumber)                              |
| `Optional` uncles       | `any`[]                                    | Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex) |
| `Optional` chainOptions | [ChainOptions](interfaces/chainoptions.md) | An object describing the blockchain                                            |

**Returns:** [Block](classes/block.md)

---

<a id="blockheaderfromrpc"></a>

### blockHeaderFromRpc

▸ **blockHeaderFromRpc**(blockParams: _`any`_, chainOptions?: _[ChainOptions](interfaces/chainoptions.md)_): [BlockHeader](classes/blockheader.md)

_Defined in [header-from-rpc.ts:11](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header-from-rpc.ts#L11)_

Creates a new block header object from Ethereum JSON RPC.

**Parameters:**

| Name                    | Type                                       | Description                                       |
| ----------------------- | ------------------------------------------ | ------------------------------------------------- |
| blockParams             | `any`                                      | Ethereum JSON RPC of block (eth_getBlockByNumber) |
| `Optional` chainOptions | [ChainOptions](interfaces/chainoptions.md) | An object describing the blockchain               |

**Returns:** [BlockHeader](classes/blockheader.md)

---

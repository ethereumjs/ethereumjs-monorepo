[ethereumjs-client](../README.md) › ["blockchain/chain"](../modules/_blockchain_chain_.md) › [Chain](_blockchain_chain_.chain.md)

# Class: Chain

Blockchain

**`memberof`** module:blockchain

## Hierarchy

* any

  ↳ **Chain**

## Index

### Constructors

* [constructor](_blockchain_chain_.chain.md#constructor)

### Accessors

* [blocks](_blockchain_chain_.chain.md#blocks)
* [genesis](_blockchain_chain_.chain.md#genesis)
* [headers](_blockchain_chain_.chain.md#headers)
* [networkId](_blockchain_chain_.chain.md#networkid)

### Methods

* [close](_blockchain_chain_.chain.md#close)
* [getBlock](_blockchain_chain_.chain.md#getblock)
* [getBlocks](_blockchain_chain_.chain.md#getblocks)
* [getHeaders](_blockchain_chain_.chain.md#getheaders)
* [getLatestBlock](_blockchain_chain_.chain.md#getlatestblock)
* [getLatestHeader](_blockchain_chain_.chain.md#getlatestheader)
* [getTd](_blockchain_chain_.chain.md#gettd)
* [init](_blockchain_chain_.chain.md#init)
* [open](_blockchain_chain_.chain.md#open)
* [putBlocks](_blockchain_chain_.chain.md#putblocks)
* [putHeaders](_blockchain_chain_.chain.md#putheaders)
* [reset](_blockchain_chain_.chain.md#reset)
* [update](_blockchain_chain_.chain.md#update)

## Constructors

###  constructor

\+ **new Chain**(`options`: object): *[Chain](_blockchain_chain_.chain.md)*

*Defined in [lib/blockchain/chain.js:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L20)*

Create new chain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[Chain](_blockchain_chain_.chain.md)*

## Accessors

###  blocks

• **get blocks**(): *Object*

*Defined in [lib/blockchain/chain.js:102](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L102)*

Returns properties of the canonical blockchain. The ``latest`` property is
the latest block in the chain, the ``td`` property is the total difficulty of
blockchain, and the ``height`` is the height of the blockchain.

**`type`** {Object}

**Returns:** *Object*

___

###  genesis

• **get genesis**(): *Object*

*Defined in [lib/blockchain/chain.js:80](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L80)*

Genesis block parameters

**`type`** {Object}

**Returns:** *Object*

___

###  headers

• **get headers**(): *Object*

*Defined in [lib/blockchain/chain.js:92](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L92)*

Returns properties of the canonical headerchain. The ``latest`` property is
the latest header in the chain, the ``td`` property is the total difficulty of
headerchain, and the ``height`` is the height of the headerchain.

**`type`** {Object}

**Returns:** *Object*

___

###  networkId

• **get networkId**(): *number*

*Defined in [lib/blockchain/chain.js:72](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L72)*

Network ID

**`type`** {number}

**Returns:** *number*

## Methods

###  close

▸ **close**(): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:124](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L124)*

Close blockchain and database

**Returns:** *Promise‹any›*

___

###  getBlock

▸ **getBlock**(`block`: any): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:181](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L181)*

Gets a block by its hash or number

**Parameters:**

Name | Type |
------ | ------ |
`block` | any |

**Returns:** *Promise‹any›*

___

###  getBlocks

▸ **getBlocks**(`block`: Buffer‹› | [BN](../modules/_blockchain_chain_.md#bn)‹›, `max`: number, `skip`: number, `reverse`: boolean): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:166](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L166)*

Get blocks from blockchain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`block` | Buffer‹› &#124; [BN](../modules/_blockchain_chain_.md#bn)‹› | block hash or number to start from |
`max` | number | maximum number of blocks to get |
`skip` | number | number of blocks to skip |
`reverse` | boolean | get blocks in reverse |

**Returns:** *Promise‹any›*

___

###  getHeaders

▸ **getHeaders**(`block`: Buffer‹› | [BN](../modules/_blockchain_chain_.md#bn)‹›, `max`: number, `skip`: number, `reverse`: boolean): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:221](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L221)*

Get headers from blockchain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`block` | Buffer‹› &#124; [BN](../modules/_blockchain_chain_.md#bn)‹› | block hash or number to start from |
`max` | number | maximum number of headers to get |
`skip` | number | number of headers to skip |
`reverse` | boolean | get headers in reverse |

**Returns:** *Promise‹any›*

___

###  getLatestBlock

▸ **getLatestBlock**(): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:265](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L265)*

Gets the latest block in the canonical chain

**Returns:** *Promise‹any›*

___

###  getLatestHeader

▸ **getLatestHeader**(): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:251](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L251)*

Gets the latest header in the canonical chain

**Returns:** *Promise‹any›*

___

###  getTd

▸ **getTd**(`hash`: Buffer‹›): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:280](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L280)*

Gets total difficulty for a block

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hash` | Buffer‹› | block hash |

**Returns:** *Promise‹any›*

___

###  init

▸ **init**(): *void*

*Defined in [lib/blockchain/chain.js:39](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L39)*

**Returns:** *void*

___

###  open

▸ **open**(): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:110](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L110)*

Open blockchain and wait for database to load

**Returns:** *Promise‹any›*

___

###  putBlocks

▸ **putBlocks**(`blocks`: any[]): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:198](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L198)*

Insert new blocks into blockchain

**`method`** putBlocks

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blocks` | any[] | list of blocks to add |

**Returns:** *Promise‹any›*

___

###  putHeaders

▸ **putHeaders**(`headers`: any[]): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:232](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L232)*

Insert new headers into blockchain

**`method`** putHeaders

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`headers` | any[] | list of headers to add |

**Returns:** *Promise‹any›*

___

###  reset

▸ **reset**(): *void*

*Defined in [lib/blockchain/chain.js:55](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L55)*

**Returns:** *void*

___

###  update

▸ **update**(): *Promise‹any›*

*Defined in [lib/blockchain/chain.js:137](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L137)*

Update blockchain properties (latest block, td, height, etc...)

**Returns:** *Promise‹any›*

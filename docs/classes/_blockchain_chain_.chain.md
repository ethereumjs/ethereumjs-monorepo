[ethereumjs-client](../README.md) › ["blockchain/chain"](../modules/_blockchain_chain_.md) › [Chain](_blockchain_chain_.chain.md)

# Class: Chain

Blockchain

**`memberof`** module:blockchain

## Hierarchy

* EventEmitter

  ↳ **Chain**

## Index

### Constructors

* [constructor](_blockchain_chain_.chain.md#constructor)

### Properties

* [blockchain](_blockchain_chain_.chain.md#blockchain)
* [config](_blockchain_chain_.chain.md#config)
* [db](_blockchain_chain_.chain.md#db)
* [opened](_blockchain_chain_.chain.md#opened)
* [defaultMaxListeners](_blockchain_chain_.chain.md#static-defaultmaxlisteners)
* [errorMonitor](_blockchain_chain_.chain.md#static-errormonitor)

### Accessors

* [blocks](_blockchain_chain_.chain.md#blocks)
* [genesis](_blockchain_chain_.chain.md#genesis)
* [headers](_blockchain_chain_.chain.md#headers)
* [networkId](_blockchain_chain_.chain.md#networkid)

### Methods

* [addListener](_blockchain_chain_.chain.md#addlistener)
* [close](_blockchain_chain_.chain.md#close)
* [emit](_blockchain_chain_.chain.md#emit)
* [eventNames](_blockchain_chain_.chain.md#eventnames)
* [getBlock](_blockchain_chain_.chain.md#getblock)
* [getBlocks](_blockchain_chain_.chain.md#getblocks)
* [getHeaders](_blockchain_chain_.chain.md#getheaders)
* [getLatestBlock](_blockchain_chain_.chain.md#getlatestblock)
* [getLatestHeader](_blockchain_chain_.chain.md#getlatestheader)
* [getMaxListeners](_blockchain_chain_.chain.md#getmaxlisteners)
* [getTd](_blockchain_chain_.chain.md#gettd)
* [listenerCount](_blockchain_chain_.chain.md#listenercount)
* [listeners](_blockchain_chain_.chain.md#listeners)
* [off](_blockchain_chain_.chain.md#off)
* [on](_blockchain_chain_.chain.md#on)
* [once](_blockchain_chain_.chain.md#once)
* [open](_blockchain_chain_.chain.md#open)
* [prependListener](_blockchain_chain_.chain.md#prependlistener)
* [prependOnceListener](_blockchain_chain_.chain.md#prependoncelistener)
* [putBlocks](_blockchain_chain_.chain.md#putblocks)
* [putHeaders](_blockchain_chain_.chain.md#putheaders)
* [rawListeners](_blockchain_chain_.chain.md#rawlisteners)
* [removeAllListeners](_blockchain_chain_.chain.md#removealllisteners)
* [removeListener](_blockchain_chain_.chain.md#removelistener)
* [setMaxListeners](_blockchain_chain_.chain.md#setmaxlisteners)
* [update](_blockchain_chain_.chain.md#update)
* [listenerCount](_blockchain_chain_.chain.md#static-listenercount)

## Constructors

###  constructor

\+ **new Chain**(`options`: [ChainOptions](../interfaces/_blockchain_chain_.chainoptions.md)): *[Chain](_blockchain_chain_.chain.md)*

*Overrides void*

*Defined in [lib/blockchain/chain.ts:96](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L96)*

Create new chain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | [ChainOptions](../interfaces/_blockchain_chain_.chainoptions.md) |   |

**Returns:** *[Chain](_blockchain_chain_.chain.md)*

## Properties

###  blockchain

• **blockchain**: *Blockchain*

*Defined in [lib/blockchain/chain.ts:83](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L83)*

___

###  config

• **config**: *[Config](_config_.config.md)*

*Defined in [lib/blockchain/chain.ts:80](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L80)*

___

###  db

• **db**: *LevelUp*

*Defined in [lib/blockchain/chain.ts:82](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L82)*

___

###  opened

• **opened**: *boolean*

*Defined in [lib/blockchain/chain.ts:84](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L84)*

___

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[defaultMaxListeners](_net_protocol_sender_.sender.md#static-defaultmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:45

___

### `Static` errorMonitor

▪ **errorMonitor**: *keyof symbol*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[errorMonitor](_net_protocol_sender_.sender.md#static-errormonitor)*

Defined in node_modules/@types/node/events.d.ts:55

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Accessors

###  blocks

• **get blocks**(): *[ChainBlocks](../interfaces/_blockchain_chain_.chainblocks.md)*

*Defined in [lib/blockchain/chain.ts:167](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L167)*

Returns properties of the canonical blockchain.

**Returns:** *[ChainBlocks](../interfaces/_blockchain_chain_.chainblocks.md)*

___

###  genesis

• **get genesis**(): *[GenesisBlockParams](../interfaces/_blockchain_chain_.genesisblockparams.md)*

*Defined in [lib/blockchain/chain.ts:147](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L147)*

Genesis block parameters

**Returns:** *[GenesisBlockParams](../interfaces/_blockchain_chain_.genesisblockparams.md)*

___

###  headers

• **get headers**(): *[ChainHeaders](../interfaces/_blockchain_chain_.chainheaders.md)*

*Defined in [lib/blockchain/chain.ts:159](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L159)*

Returns properties of the canonical headerchain.

**Returns:** *[ChainHeaders](../interfaces/_blockchain_chain_.chainheaders.md)*

___

###  networkId

• **get networkId**(): *number*

*Defined in [lib/blockchain/chain.ts:140](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L140)*

Network ID

**Returns:** *number*

## Methods

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)*

Defined in node_modules/@types/node/events.d.ts:62

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  close

▸ **close**(): *Promise‹boolean | void›*

*Defined in [lib/blockchain/chain.ts:189](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L189)*

Closes chain

**Returns:** *Promise‹boolean | void›*

Returns false if chain is closed

___

###  emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)*

Defined in node_modules/@types/node/events.d.ts:72

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`...args` | any[] |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[eventNames](_net_protocol_sender_.sender.md#eventnames)*

Defined in node_modules/@types/node/events.d.ts:77

**Returns:** *Array‹string | symbol›*

___

###  getBlock

▸ **getBlock**(`block`: Buffer | BN): *Promise‹Block›*

*Defined in [lib/blockchain/chain.ts:255](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L255)*

Gets a block by its hash or number

**Parameters:**

Name | Type |
------ | ------ |
`block` | Buffer &#124; BN |

**Returns:** *Promise‹Block›*

___

###  getBlocks

▸ **getBlocks**(`block`: Buffer | BN, `max`: number, `skip`: number, `reverse`: boolean): *Promise‹Block[]›*

*Defined in [lib/blockchain/chain.ts:240](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L240)*

Get blocks from blockchain

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`block` | Buffer &#124; BN | - | hash or number to start from |
`max` | number | 1 | maximum number of blocks to get |
`skip` | number | 0 | number of blocks to skip |
`reverse` | boolean | false | get blocks in reverse |

**Returns:** *Promise‹Block[]›*

___

###  getHeaders

▸ **getHeaders**(`block`: Buffer | BN, `max`: number, `skip`: number, `reverse`: boolean): *Promise‹BlockHeader[]›*

*Defined in [lib/blockchain/chain.ts:284](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L284)*

Get headers from blockchain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`block` | Buffer &#124; BN | block hash or number to start from |
`max` | number | maximum number of headers to get |
`skip` | number | number of headers to skip |
`reverse` | boolean | get headers in reverse |

**Returns:** *Promise‹BlockHeader[]›*

___

###  getLatestBlock

▸ **getLatestBlock**(): *Promise‹Block›*

*Defined in [lib/blockchain/chain.ts:324](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L324)*

Gets the latest block in the canonical chain

**Returns:** *Promise‹Block›*

___

###  getLatestHeader

▸ **getLatestHeader**(): *Promise‹BlockHeader›*

*Defined in [lib/blockchain/chain.ts:315](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L315)*

Gets the latest header in the canonical chain

**Returns:** *Promise‹BlockHeader›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:69

**Returns:** *number*

___

###  getTd

▸ **getTd**(`hash`: Buffer, `num`: BN): *Promise‹BN›*

*Defined in [lib/blockchain/chain.ts:335](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L335)*

Gets total difficulty for a block

**Parameters:**

Name | Type |
------ | ------ |
`hash` | Buffer |
`num` | BN |

**Returns:** *Promise‹BN›*

___

###  listenerCount

▸ **listenerCount**(`event`: string | symbol): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#listenercount)*

Defined in node_modules/@types/node/events.d.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[listeners](_net_protocol_sender_.sender.md#listeners)*

Defined in node_modules/@types/node/events.d.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[off](_net_protocol_sender_.sender.md#off)*

Defined in node_modules/@types/node/events.d.ts:66

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  on

▸ **on**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)*

Defined in node_modules/@types/node/events.d.ts:63

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  once

▸ **once**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)*

Defined in node_modules/@types/node/events.d.ts:64

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  open

▸ **open**(): *Promise‹boolean | void›*

*Defined in [lib/blockchain/chain.ts:175](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L175)*

Open blockchain and wait for database to load

**Returns:** *Promise‹boolean | void›*

Returns false if chain is already open

___

###  prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)*

Defined in node_modules/@types/node/events.d.ts:75

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)*

Defined in node_modules/@types/node/events.d.ts:76

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  putBlocks

▸ **putBlocks**(`blocks`: Block[]): *Promise‹void›*

*Defined in [lib/blockchain/chain.ts:264](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L264)*

Insert new blocks into blockchain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blocks` | Block[] | list of blocks to add  |

**Returns:** *Promise‹void›*

___

###  putHeaders

▸ **putHeaders**(`headers`: BlockHeader[]): *Promise‹void›*

*Defined in [lib/blockchain/chain.ts:299](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L299)*

Insert new headers into blockchain

**Parameters:**

Name | Type |
------ | ------ |
`headers` | BlockHeader[] |

**Returns:** *Promise‹void›*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *Function[]*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[rawListeners](_net_protocol_sender_.sender.md#rawlisteners)*

Defined in node_modules/@types/node/events.d.ts:71

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[removeAllListeners](_net_protocol_sender_.sender.md#removealllisteners)*

Defined in node_modules/@types/node/events.d.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)*

Defined in node_modules/@types/node/events.d.ts:65

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[setMaxListeners](_net_protocol_sender_.sender.md#setmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

###  update

▸ **update**(): *Promise‹boolean | void›*

*Defined in [lib/blockchain/chain.ts:202](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L202)*

Update blockchain properties (latest block, td, height, etc...)

**Returns:** *Promise‹boolean | void›*

Returns false if chain is closed

___

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#static-listenercount)*

Defined in node_modules/@types/node/events.d.ts:44

**`deprecated`** since v4.0.0

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string &#124; symbol |

**Returns:** *number*

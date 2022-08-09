[ethereumjs-client](../README.md) › ["blockchain/chain"](../modules/_blockchain_chain_.md) › [Chain](_blockchain_chain_.chain.md)

# Class: Chain

Blockchain

**`memberof`** module:blockchain

## Hierarchy

- EventEmitter

  ↳ **Chain**

## Index

### Constructors

- [constructor](_blockchain_chain_.chain.md#constructor)

### Properties

- [blockchain](_blockchain_chain_.chain.md#blockchain)
- [config](_blockchain_chain_.chain.md#config)
- [db](_blockchain_chain_.chain.md#db)
- [opened](_blockchain_chain_.chain.md#opened)
- [defaultMaxListeners](_blockchain_chain_.chain.md#static-defaultmaxlisteners)
- [errorMonitor](_blockchain_chain_.chain.md#static-errormonitor)

### Accessors

- [blocks](_blockchain_chain_.chain.md#blocks)
- [genesis](_blockchain_chain_.chain.md#genesis)
- [headers](_blockchain_chain_.chain.md#headers)
- [networkId](_blockchain_chain_.chain.md#networkid)

### Methods

- [addListener](_blockchain_chain_.chain.md#addlistener)
- [close](_blockchain_chain_.chain.md#close)
- [emit](_blockchain_chain_.chain.md#emit)
- [eventNames](_blockchain_chain_.chain.md#eventnames)
- [getBlock](_blockchain_chain_.chain.md#getblock)
- [getBlocks](_blockchain_chain_.chain.md#getblocks)
- [getHeaders](_blockchain_chain_.chain.md#getheaders)
- [getLatestBlock](_blockchain_chain_.chain.md#getlatestblock)
- [getLatestHeader](_blockchain_chain_.chain.md#getlatestheader)
- [getMaxListeners](_blockchain_chain_.chain.md#getmaxlisteners)
- [getTd](_blockchain_chain_.chain.md#gettd)
- [listenerCount](_blockchain_chain_.chain.md#listenercount)
- [listeners](_blockchain_chain_.chain.md#listeners)
- [off](_blockchain_chain_.chain.md#off)
- [on](_blockchain_chain_.chain.md#on)
- [once](_blockchain_chain_.chain.md#once)
- [open](_blockchain_chain_.chain.md#open)
- [prependListener](_blockchain_chain_.chain.md#prependlistener)
- [prependOnceListener](_blockchain_chain_.chain.md#prependoncelistener)
- [putBlocks](_blockchain_chain_.chain.md#putblocks)
- [putHeaders](_blockchain_chain_.chain.md#putheaders)
- [rawListeners](_blockchain_chain_.chain.md#rawlisteners)
- [removeAllListeners](_blockchain_chain_.chain.md#removealllisteners)
- [removeListener](_blockchain_chain_.chain.md#removelistener)
- [setMaxListeners](_blockchain_chain_.chain.md#setmaxlisteners)
- [update](_blockchain_chain_.chain.md#update)
- [listenerCount](_blockchain_chain_.chain.md#static-listenercount)

## Constructors

### constructor

\+ **new Chain**(`options`: [ChainOptions](../interfaces/_blockchain_chain_.chainoptions.md)): _[Chain](_blockchain_chain_.chain.md)_

_Overrides void_

_Defined in [lib/blockchain/chain.ts:96](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L96)_

Create new chain

**Parameters:**

| Name      | Type                                                             | Description |
| --------- | ---------------------------------------------------------------- | ----------- |
| `options` | [ChainOptions](../interfaces/_blockchain_chain_.chainoptions.md) |             |

**Returns:** _[Chain](_blockchain_chain_.chain.md)_

## Properties

### blockchain

• **blockchain**: _Blockchain_

_Defined in [lib/blockchain/chain.ts:83](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L83)_

---

### config

• **config**: _[Config](_config_.config.md)_

_Defined in [lib/blockchain/chain.ts:80](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L80)_

---

### db

• **db**: _LevelUp_

_Defined in [lib/blockchain/chain.ts:82](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L82)_

---

### opened

• **opened**: _boolean_

_Defined in [lib/blockchain/chain.ts:84](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L84)_

---

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[defaultMaxListeners](_net_protocol_sender_.sender.md#static-defaultmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:45

---

### `Static` errorMonitor

▪ **errorMonitor**: _keyof symbol_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[errorMonitor](_net_protocol_sender_.sender.md#static-errormonitor)_

Defined in node_modules/@types/node/events.d.ts:55

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Accessors

### blocks

• **get blocks**(): _[ChainBlocks](../interfaces/_blockchain_chain_.chainblocks.md)_

_Defined in [lib/blockchain/chain.ts:167](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L167)_

Returns properties of the canonical blockchain.

**Returns:** _[ChainBlocks](../interfaces/_blockchain_chain_.chainblocks.md)_

---

### genesis

• **get genesis**(): _[GenesisBlockParams](../interfaces/_blockchain_chain_.genesisblockparams.md)_

_Defined in [lib/blockchain/chain.ts:147](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L147)_

Genesis block parameters

**Returns:** _[GenesisBlockParams](../interfaces/_blockchain_chain_.genesisblockparams.md)_

---

### headers

• **get headers**(): _[ChainHeaders](../interfaces/_blockchain_chain_.chainheaders.md)_

_Defined in [lib/blockchain/chain.ts:159](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L159)_

Returns properties of the canonical headerchain.

**Returns:** _[ChainHeaders](../interfaces/_blockchain_chain_.chainheaders.md)_

---

### networkId

• **get networkId**(): _number_

_Defined in [lib/blockchain/chain.ts:140](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L140)_

Network ID

**Returns:** _number_

## Methods

### addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/events.d.ts:62

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### close

▸ **close**(): _Promise‹boolean | void›_

_Defined in [lib/blockchain/chain.ts:189](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L189)_

Closes chain

**Returns:** _Promise‹boolean | void›_

Returns false if chain is closed

---

### emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): _boolean_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/events.d.ts:72

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `event`   | string &#124; symbol |
| `...args` | any[]                |

**Returns:** _boolean_

---

### eventNames

▸ **eventNames**(): _Array‹string | symbol›_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[eventNames](_net_protocol_sender_.sender.md#eventnames)_

Defined in node_modules/@types/node/events.d.ts:77

**Returns:** _Array‹string | symbol›_

---

### getBlock

▸ **getBlock**(`block`: Buffer | BN): _Promise‹Block›_

_Defined in [lib/blockchain/chain.ts:255](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L255)_

Gets a block by its hash or number

**Parameters:**

| Name    | Type             |
| ------- | ---------------- |
| `block` | Buffer &#124; BN |

**Returns:** _Promise‹Block›_

---

### getBlocks

▸ **getBlocks**(`block`: Buffer | BN, `max`: number, `skip`: number, `reverse`: boolean): _Promise‹Block[]›_

_Defined in [lib/blockchain/chain.ts:240](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L240)_

Get blocks from blockchain

**Parameters:**

| Name      | Type             | Default | Description                     |
| --------- | ---------------- | ------- | ------------------------------- |
| `block`   | Buffer &#124; BN | -       | hash or number to start from    |
| `max`     | number           | 1       | maximum number of blocks to get |
| `skip`    | number           | 0       | number of blocks to skip        |
| `reverse` | boolean          | false   | get blocks in reverse           |

**Returns:** _Promise‹Block[]›_

---

### getHeaders

▸ **getHeaders**(`block`: Buffer | BN, `max`: number, `skip`: number, `reverse`: boolean): _Promise‹BlockHeader[]›_

_Defined in [lib/blockchain/chain.ts:284](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L284)_

Get headers from blockchain

**Parameters:**

| Name      | Type             | Description                        |
| --------- | ---------------- | ---------------------------------- |
| `block`   | Buffer &#124; BN | block hash or number to start from |
| `max`     | number           | maximum number of headers to get   |
| `skip`    | number           | number of headers to skip          |
| `reverse` | boolean          | get headers in reverse             |

**Returns:** _Promise‹BlockHeader[]›_

---

### getLatestBlock

▸ **getLatestBlock**(): _Promise‹Block›_

_Defined in [lib/blockchain/chain.ts:324](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L324)_

Gets the latest block in the canonical chain

**Returns:** _Promise‹Block›_

---

### getLatestHeader

▸ **getLatestHeader**(): _Promise‹BlockHeader›_

_Defined in [lib/blockchain/chain.ts:315](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L315)_

Gets the latest header in the canonical chain

**Returns:** _Promise‹BlockHeader›_

---

### getMaxListeners

▸ **getMaxListeners**(): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:69

**Returns:** _number_

---

### getTd

▸ **getTd**(`hash`: Buffer, `num`: BN): _Promise‹BN›_

_Defined in [lib/blockchain/chain.ts:335](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L335)_

Gets total difficulty for a block

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `hash` | Buffer |
| `num`  | BN     |

**Returns:** _Promise‹BN›_

---

### listenerCount

▸ **listenerCount**(`event`: string | symbol): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#listenercount)_

Defined in node_modules/@types/node/events.d.ts:73

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _number_

---

### listeners

▸ **listeners**(`event`: string | symbol): _Function[]_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listeners](_net_protocol_sender_.sender.md#listeners)_

Defined in node_modules/@types/node/events.d.ts:70

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### off

▸ **off**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[off](_net_protocol_sender_.sender.md#off)_

Defined in node_modules/@types/node/events.d.ts:66

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### on

▸ **on**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/events.d.ts:63

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### once

▸ **once**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/events.d.ts:64

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### open

▸ **open**(): _Promise‹boolean | void›_

_Defined in [lib/blockchain/chain.ts:175](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L175)_

Open blockchain and wait for database to load

**Returns:** _Promise‹boolean | void›_

Returns false if chain is already open

---

### prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/events.d.ts:75

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/events.d.ts:76

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### putBlocks

▸ **putBlocks**(`blocks`: Block[]): _Promise‹void›_

_Defined in [lib/blockchain/chain.ts:264](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L264)_

Insert new blocks into blockchain

**Parameters:**

| Name     | Type    | Description           |
| -------- | ------- | --------------------- |
| `blocks` | Block[] | list of blocks to add |

**Returns:** _Promise‹void›_

---

### putHeaders

▸ **putHeaders**(`headers`: BlockHeader[]): _Promise‹void›_

_Defined in [lib/blockchain/chain.ts:299](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L299)_

Insert new headers into blockchain

**Parameters:**

| Name      | Type          |
| --------- | ------------- |
| `headers` | BlockHeader[] |

**Returns:** _Promise‹void›_

---

### rawListeners

▸ **rawListeners**(`event`: string | symbol): _Function[]_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[rawListeners](_net_protocol_sender_.sender.md#rawlisteners)_

Defined in node_modules/@types/node/events.d.ts:71

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[removeAllListeners](_net_protocol_sender_.sender.md#removealllisteners)_

Defined in node_modules/@types/node/events.d.ts:67

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| `event?` | string &#124; symbol |

**Returns:** _this_

---

### removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/events.d.ts:65

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### setMaxListeners

▸ **setMaxListeners**(`n`: number): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[setMaxListeners](_net_protocol_sender_.sender.md#setmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:68

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `n`  | number |

**Returns:** _this_

---

### update

▸ **update**(): _Promise‹boolean | void›_

_Defined in [lib/blockchain/chain.ts:202](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L202)_

Update blockchain properties (latest block, td, height, etc...)

**Returns:** _Promise‹boolean | void›_

Returns false if chain is closed

---

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#static-listenercount)_

Defined in node_modules/@types/node/events.d.ts:44

**`deprecated`** since v4.0.0

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `emitter` | EventEmitter         |
| `event`   | string &#124; symbol |

**Returns:** _number_

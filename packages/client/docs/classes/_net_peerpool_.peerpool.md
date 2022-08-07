[ethereumjs-client](../README.md) › ["net/peerpool"](../modules/_net_peerpool_.md) › [PeerPool](_net_peerpool_.peerpool.md)

# Class: PeerPool

Pool of connected peers

**`memberof`** module:net

**`emits`** connected

**`emits`** disconnected

**`emits`** banned

**`emits`** added

**`emits`** removed

**`emits`** message

**`emits`** message:{protocol}

**`emits`** error

## Hierarchy

- EventEmitter

  ↳ **PeerPool**

## Index

### Constructors

- [constructor](_net_peerpool_.peerpool.md#constructor)

### Properties

- [config](_net_peerpool_.peerpool.md#config)
- [defaultMaxListeners](_net_peerpool_.peerpool.md#static-defaultmaxlisteners)
- [errorMonitor](_net_peerpool_.peerpool.md#static-errormonitor)

### Accessors

- [peers](_net_peerpool_.peerpool.md#peers)
- [size](_net_peerpool_.peerpool.md#size)

### Methods

- [\_statusCheck](_net_peerpool_.peerpool.md#_statuscheck)
- [add](_net_peerpool_.peerpool.md#add)
- [addListener](_net_peerpool_.peerpool.md#addlistener)
- [ban](_net_peerpool_.peerpool.md#ban)
- [close](_net_peerpool_.peerpool.md#close)
- [connected](_net_peerpool_.peerpool.md#private-connected)
- [contains](_net_peerpool_.peerpool.md#contains)
- [disconnected](_net_peerpool_.peerpool.md#private-disconnected)
- [emit](_net_peerpool_.peerpool.md#emit)
- [eventNames](_net_peerpool_.peerpool.md#eventnames)
- [getMaxListeners](_net_peerpool_.peerpool.md#getmaxlisteners)
- [idle](_net_peerpool_.peerpool.md#idle)
- [init](_net_peerpool_.peerpool.md#init)
- [listenerCount](_net_peerpool_.peerpool.md#listenercount)
- [listeners](_net_peerpool_.peerpool.md#listeners)
- [off](_net_peerpool_.peerpool.md#off)
- [on](_net_peerpool_.peerpool.md#on)
- [once](_net_peerpool_.peerpool.md#once)
- [open](_net_peerpool_.peerpool.md#open)
- [prependListener](_net_peerpool_.peerpool.md#prependlistener)
- [prependOnceListener](_net_peerpool_.peerpool.md#prependoncelistener)
- [rawListeners](_net_peerpool_.peerpool.md#rawlisteners)
- [remove](_net_peerpool_.peerpool.md#remove)
- [removeAllListeners](_net_peerpool_.peerpool.md#removealllisteners)
- [removeListener](_net_peerpool_.peerpool.md#removelistener)
- [setMaxListeners](_net_peerpool_.peerpool.md#setmaxlisteners)
- [listenerCount](_net_peerpool_.peerpool.md#static-listenercount)

## Constructors

### constructor

\+ **new PeerPool**(`options`: [PeerPoolOptions](../interfaces/_net_peerpool_.peerpooloptions.md)): _[PeerPool](_net_peerpool_.peerpool.md)_

_Overrides void_

_Defined in [lib/net/peerpool.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L33)_

Create new peer pool

**Parameters:**

| Name      | Type                                                               | Description            |
| --------- | ------------------------------------------------------------------ | ---------------------- |
| `options` | [PeerPoolOptions](../interfaces/_net_peerpool_.peerpooloptions.md) | constructor parameters |

**Returns:** _[PeerPool](_net_peerpool_.peerpool.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Defined in [lib/net/peerpool.ts:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L28)_

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

### peers

• **get peers**(): _[Peer](_net_peer_peer_.peer.md)[]_

_Defined in [lib/net/peerpool.ts:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L90)_

Connected peers

**Returns:** _[Peer](_net_peer_peer_.peer.md)[]_

---

### size

• **get size**(): _number_

_Defined in [lib/net/peerpool.ts:99](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L99)_

Number of peers in pool

**`type`** {number}

**Returns:** _number_

## Methods

### \_statusCheck

▸ **\_statusCheck**(): _Promise‹void›_

_Defined in [lib/net/peerpool.ts:202](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L202)_

Peer pool status check on a repeated interval

**Returns:** _Promise‹void›_

---

### add

▸ **add**(`peer?`: [Peer](_net_peer_peer_.peer.md)): _void_

_Defined in [lib/net/peerpool.ts:179](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L179)_

Add peer to pool

**`emits`** added

**`emits`** message

**`emits`** message:{protocol}

**Parameters:**

| Name    | Type                            |
| ------- | ------------------------------- |
| `peer?` | [Peer](_net_peer_peer_.peer.md) |

**Returns:** _void_

---

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

### ban

▸ **ban**(`peer`: [Peer](_net_peer_peer_.peer.md), `maxAge`: number): _void_

_Defined in [lib/net/peerpool.ts:162](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L162)_

Ban peer from being added to the pool for a period of time

**`emits`** banned

**Parameters:**

| Name     | Type                            | Default | Description                |
| -------- | ------------------------------- | ------- | -------------------------- |
| `peer`   | [Peer](_net_peer_peer_.peer.md) | -       | -                          |
| `maxAge` | number                          | 60000   | ban period in milliseconds |

**Returns:** _void_

---

### close

▸ **close**(): _Promise‹void›_

_Defined in [lib/net/peerpool.ts:81](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L81)_

Close pool

**Returns:** _Promise‹void›_

---

### `Private` connected

▸ **connected**(`peer`: [Peer](_net_peer_peer_.peer.md)): _void_

_Defined in [lib/net/peerpool.ts:130](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L130)_

Handler for peer connections

**Parameters:**

| Name   | Type                            | Description |
| ------ | ------------------------------- | ----------- |
| `peer` | [Peer](_net_peer_peer_.peer.md) |             |

**Returns:** _void_

---

### contains

▸ **contains**(`peer`: [Peer](_net_peer_peer_.peer.md) | string): _boolean_

_Defined in [lib/net/peerpool.ts:107](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L107)_

Return true if pool contains the specified peer

**Parameters:**

| Name   | Type                                          | Description       |
| ------ | --------------------------------------------- | ----------------- |
| `peer` | [Peer](_net_peer_peer_.peer.md) &#124; string | object or peer id |

**Returns:** _boolean_

---

### `Private` disconnected

▸ **disconnected**(`peer`: [Peer](_net_peer_peer_.peer.md)): _void_

_Defined in [lib/net/peerpool.ts:152](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L152)_

Handler for peer disconnections

**Parameters:**

| Name   | Type                            | Description |
| ------ | ------------------------------- | ----------- |
| `peer` | [Peer](_net_peer_peer_.peer.md) |             |

**Returns:** _void_

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

### getMaxListeners

▸ **getMaxListeners**(): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:69

**Returns:** _number_

---

### idle

▸ **idle**(`filterFn`: (Anonymous function)): _[Peer](_net_peer_peer_.peer.md)_

_Defined in [lib/net/peerpool.ts:119](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L119)_

Returns a random idle peer from the pool

**Parameters:**

| Name       | Type                 | Default                |
| ---------- | -------------------- | ---------------------- |
| `filterFn` | (Anonymous function) | (\_peer: Peer) => true |

**Returns:** _[Peer](_net_peer_peer_.peer.md)_

---

### init

▸ **init**(): _void_

_Defined in [lib/net/peerpool.ts:52](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L52)_

**Returns:** _void_

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

_Defined in [lib/net/peerpool.ts:60](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L60)_

Open pool

**Returns:** _Promise‹boolean | void›_

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

### remove

▸ **remove**(`peer?`: [Peer](_net_peer_peer_.peer.md)): _void_

_Defined in [lib/net/peerpool.ts:191](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L191)_

Remove peer from pool

**`emits`** removed

**Parameters:**

| Name    | Type                            |
| ------- | ------------------------------- |
| `peer?` | [Peer](_net_peer_peer_.peer.md) |

**Returns:** _void_

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

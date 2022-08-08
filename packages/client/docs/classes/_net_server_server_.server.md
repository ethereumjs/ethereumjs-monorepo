[ethereumjs-client](../README.md) › ["net/server/server"](../modules/_net_server_server_.md) › [Server](_net_server_server_.server.md)

# Class: Server

Base class for transport specific server implementations.

**`memberof`** module:net/server

## Hierarchy

- EventEmitter

  ↳ **Server**

  ↳ [RlpxServer](_net_server_rlpxserver_.rlpxserver.md)

  ↳ [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)

## Index

### Constructors

- [constructor](_net_server_server_.server.md#constructor)

### Properties

- [bootnodes](_net_server_server_.server.md#bootnodes)
- [config](_net_server_server_.server.md#config)
- [key](_net_server_server_.server.md#key)
- [started](_net_server_server_.server.md#started)
- [defaultMaxListeners](_net_server_server_.server.md#static-defaultmaxlisteners)
- [errorMonitor](_net_server_server_.server.md#static-errormonitor)

### Accessors

- [name](_net_server_server_.server.md#name)
- [running](_net_server_server_.server.md#running)

### Methods

- [addListener](_net_server_server_.server.md#addlistener)
- [addProtocols](_net_server_server_.server.md#addprotocols)
- [ban](_net_server_server_.server.md#protected-ban)
- [emit](_net_server_server_.server.md#emit)
- [eventNames](_net_server_server_.server.md#eventnames)
- [getMaxListeners](_net_server_server_.server.md#getmaxlisteners)
- [listenerCount](_net_server_server_.server.md#listenercount)
- [listeners](_net_server_server_.server.md#listeners)
- [off](_net_server_server_.server.md#off)
- [on](_net_server_server_.server.md#on)
- [once](_net_server_server_.server.md#once)
- [prependListener](_net_server_server_.server.md#prependlistener)
- [prependOnceListener](_net_server_server_.server.md#prependoncelistener)
- [rawListeners](_net_server_server_.server.md#rawlisteners)
- [removeAllListeners](_net_server_server_.server.md#removealllisteners)
- [removeListener](_net_server_server_.server.md#removelistener)
- [setMaxListeners](_net_server_server_.server.md#setmaxlisteners)
- [start](_net_server_server_.server.md#start)
- [stop](_net_server_server_.server.md#stop)
- [listenerCount](_net_server_server_.server.md#static-listenercount)

## Constructors

### constructor

\+ **new Server**(`options`: [ServerOptions](../interfaces/_net_server_server_.serveroptions.md)): _[Server](_net_server_server_.server.md)_

_Overrides void_

_Defined in [lib/net/server/server.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L33)_

Create new server

**Parameters:**

| Name      | Type                                                                |
| --------- | ------------------------------------------------------------------- |
| `options` | [ServerOptions](../interfaces/_net_server_server_.serveroptions.md) |

**Returns:** _[Server](_net_server_server_.server.md)_

## Properties

### bootnodes

• **bootnodes**: _[Bootnode](../interfaces/_types_.bootnode.md)[]_ = []

_Defined in [lib/net/server/server.ts:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L28)_

---

### config

• **config**: _[Config](_config_.config.md)_

_Defined in [lib/net/server/server.ts:26](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L26)_

---

### key

• **key**: _Buffer | undefined_

_Defined in [lib/net/server/server.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L27)_

---

### started

• **started**: _boolean_

_Defined in [lib/net/server/server.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L33)_

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

### name

• **get name**(): _string_

_Defined in [lib/net/server/server.ts:51](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L51)_

**Returns:** _string_

---

### running

• **get running**(): _boolean_

_Defined in [lib/net/server/server.ts:58](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L58)_

Check if server is running

**Returns:** _boolean_

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

### addProtocols

▸ **addProtocols**(`protocols`: [Protocol](_net_protocol_protocol_.protocol.md)[]): _boolean_

_Defined in [lib/net/server/server.ts:92](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L92)_

Specify which protocols the server must support

**Parameters:**

| Name        | Type                                              | Description      |
| ----------- | ------------------------------------------------- | ---------------- |
| `protocols` | [Protocol](_net_protocol_protocol_.protocol.md)[] | protocol classes |

**Returns:** _boolean_

True if protocol added successfully

---

### `Protected` ban

▸ **ban**(`_peerId`: string, `_maxAge`: number): _void_

_Defined in [lib/net/server/server.ts:108](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L108)_

Ban peer for a specified time

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `_peerId` | string |
| `_maxAge` | number |

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

### start

▸ **start**(): _Promise‹boolean›_

_Defined in [lib/net/server/server.ts:66](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L66)_

Start server. Returns a promise that resolves once server has been started.

**Returns:** _Promise‹boolean›_

Resolves with true if server successfully started

---

### stop

▸ **stop**(): _Promise‹boolean›_

_Defined in [lib/net/server/server.ts:81](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L81)_

Stop server. Returns a promise that resolves once server has been stopped.

**Returns:** _Promise‹boolean›_

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

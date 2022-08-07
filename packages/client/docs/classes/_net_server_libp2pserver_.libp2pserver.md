[ethereumjs-client](../README.md) › ["net/server/libp2pserver"](../modules/_net_server_libp2pserver_.md) › [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)

# Class: Libp2pServer

Libp2p server

**`emits`** connected

**`emits`** disconnected

**`emits`** error

**`memberof`** module:net/server

## Hierarchy

↳ [Server](_net_server_server_.server.md)

↳ **Libp2pServer**

## Index

### Constructors

- [constructor](_net_server_libp2pserver_.libp2pserver.md#constructor)

### Properties

- [bootnodes](_net_server_libp2pserver_.libp2pserver.md#bootnodes)
- [config](_net_server_libp2pserver_.libp2pserver.md#config)
- [key](_net_server_libp2pserver_.libp2pserver.md#key)
- [started](_net_server_libp2pserver_.libp2pserver.md#started)

### Accessors

- [name](_net_server_libp2pserver_.libp2pserver.md#name)
- [running](_net_server_libp2pserver_.libp2pserver.md#running)

### Methods

- [addListener](_net_server_libp2pserver_.libp2pserver.md#addlistener)
- [addProtocols](_net_server_libp2pserver_.libp2pserver.md#addprotocols)
- [ban](_net_server_libp2pserver_.libp2pserver.md#ban)
- [createPeer](_net_server_libp2pserver_.libp2pserver.md#createpeer)
- [createPeerInfo](_net_server_libp2pserver_.libp2pserver.md#createpeerinfo)
- [emit](_net_server_libp2pserver_.libp2pserver.md#emit)
- [error](_net_server_libp2pserver_.libp2pserver.md#private-error)
- [eventNames](_net_server_libp2pserver_.libp2pserver.md#eventnames)
- [getMaxListeners](_net_server_libp2pserver_.libp2pserver.md#getmaxlisteners)
- [getPeerInfo](_net_server_libp2pserver_.libp2pserver.md#getpeerinfo)
- [isBanned](_net_server_libp2pserver_.libp2pserver.md#isbanned)
- [listenerCount](_net_server_libp2pserver_.libp2pserver.md#listenercount)
- [listeners](_net_server_libp2pserver_.libp2pserver.md#listeners)
- [off](_net_server_libp2pserver_.libp2pserver.md#off)
- [on](_net_server_libp2pserver_.libp2pserver.md#on)
- [once](_net_server_libp2pserver_.libp2pserver.md#once)
- [prependListener](_net_server_libp2pserver_.libp2pserver.md#prependlistener)
- [prependOnceListener](_net_server_libp2pserver_.libp2pserver.md#prependoncelistener)
- [rawListeners](_net_server_libp2pserver_.libp2pserver.md#rawlisteners)
- [removeAllListeners](_net_server_libp2pserver_.libp2pserver.md#removealllisteners)
- [removeListener](_net_server_libp2pserver_.libp2pserver.md#removelistener)
- [setMaxListeners](_net_server_libp2pserver_.libp2pserver.md#setmaxlisteners)
- [start](_net_server_libp2pserver_.libp2pserver.md#start)
- [stop](_net_server_libp2pserver_.libp2pserver.md#stop)

## Constructors

### constructor

\+ **new Libp2pServer**(`options`: [Libp2pServerOptions](../interfaces/_net_server_libp2pserver_.libp2pserveroptions.md)): _[Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)_

_Overrides [Server](_net_server_server_.server.md).[constructor](_net_server_server_.server.md#constructor)_

_Defined in [lib/net/server/libp2pserver.ts:25](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L25)_

Create new DevP2P/RLPx server

**Parameters:**

| Name      | Type                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| `options` | [Libp2pServerOptions](../interfaces/_net_server_libp2pserver_.libp2pserveroptions.md) |

**Returns:** _[Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)_

## Properties

### bootnodes

• **bootnodes**: _[Bootnode](../interfaces/_types_.bootnode.md)[]_ = []

_Inherited from [Server](_net_server_server_.server.md).[bootnodes](_net_server_server_.server.md#bootnodes)_

_Defined in [lib/net/server/server.ts:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L28)_

---

### config

• **config**: _[Config](_config_.config.md)_

_Inherited from [Server](_net_server_server_.server.md).[config](_net_server_server_.server.md#config)_

_Defined in [lib/net/server/server.ts:26](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L26)_

---

### key

• **key**: _Buffer | undefined_

_Inherited from [Server](_net_server_server_.server.md).[key](_net_server_server_.server.md#key)_

_Defined in [lib/net/server/server.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L27)_

---

### started

• **started**: _boolean_

_Inherited from [Server](_net_server_server_.server.md).[started](_net_server_server_.server.md#started)_

_Defined in [lib/net/server/server.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L33)_

## Accessors

### name

• **get name**(): _string_

_Overrides [Server](_net_server_server_.server.md).[name](_net_server_server_.server.md#name)_

_Defined in [lib/net/server/libp2pserver.ts:46](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L46)_

Server name

**`type`** {string}

**Returns:** _string_

---

### running

• **get running**(): _boolean_

_Inherited from [Server](_net_server_server_.server.md).[running](_net_server_server_.server.md#running)_

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

_Inherited from [Server](_net_server_server_.server.md).[addProtocols](_net_server_server_.server.md#addprotocols)_

_Defined in [lib/net/server/server.ts:92](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L92)_

Specify which protocols the server must support

**Parameters:**

| Name        | Type                                              | Description      |
| ----------- | ------------------------------------------------- | ---------------- |
| `protocols` | [Protocol](_net_protocol_protocol_.protocol.md)[] | protocol classes |

**Returns:** _boolean_

True if protocol added successfully

---

### ban

▸ **ban**(`peerId`: string, `maxAge`: number): _boolean_

_Overrides [Server](_net_server_server_.server.md).[ban](_net_server_server_.server.md#protected-ban)_

_Defined in [lib/net/server/libp2pserver.ts:131](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L131)_

Ban peer for a specified time

**Parameters:**

| Name     | Type   | Default | Description |
| -------- | ------ | ------- | ----------- |
| `peerId` | string | -       | id of peer  |
| `maxAge` | number | 60000   | -           |

**Returns:** _boolean_

---

### createPeer

▸ **createPeer**(`peerInfo`: any): _[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)‹›_

_Defined in [lib/net/server/libp2pserver.ts:196](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L196)_

**Parameters:**

| Name       | Type |
| ---------- | ---- |
| `peerInfo` | any  |

**Returns:** _[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)‹›_

---

### createPeerInfo

▸ **createPeerInfo**(): _Promise‹unknown›_

_Defined in [lib/net/server/libp2pserver.ts:163](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L163)_

**Returns:** _Promise‹unknown›_

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

### `Private` error

▸ **error**(`error`: Error): _void_

_Defined in [lib/net/server/libp2pserver.ts:159](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L159)_

Handles errors from server and peers

**`emits`** error

**Parameters:**

| Name    | Type  |
| ------- | ----- |
| `error` | Error |

**Returns:** _void_

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

### getPeerInfo

▸ **getPeerInfo**(`connection`: any): _Promise‹unknown›_

_Defined in [lib/net/server/libp2pserver.ts:185](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L185)_

**Parameters:**

| Name         | Type |
| ------------ | ---- |
| `connection` | any  |

**Returns:** _Promise‹unknown›_

---

### isBanned

▸ **isBanned**(`peerId`: string): _boolean_

_Defined in [lib/net/server/libp2pserver.ts:144](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L144)_

Check if peer is currently banned

**Parameters:**

| Name     | Type   | Description |
| -------- | ------ | ----------- |
| `peerId` | string | id of peer  |

**Returns:** _boolean_

true if banned

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

_Overrides [Server](_net_server_server_.server.md).[start](_net_server_server_.server.md#start)_

_Defined in [lib/net/server/libp2pserver.ts:54](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L54)_

Start Libp2p server. Returns a promise that resolves once server has been started.

**Returns:** _Promise‹boolean›_

Resolves with true if server successfully started

---

### stop

▸ **stop**(): _Promise‹boolean›_

_Overrides [Server](_net_server_server_.server.md).[stop](_net_server_server_.server.md#stop)_

_Defined in [lib/net/server/libp2pserver.ts:117](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L117)_

Stop Libp2p server. Returns a promise that resolves once server has been stopped.

**Returns:** _Promise‹boolean›_

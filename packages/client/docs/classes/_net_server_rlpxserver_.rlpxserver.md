[ethereumjs-client](../README.md) › ["net/server/rlpxserver"](../modules/_net_server_rlpxserver_.md) › [RlpxServer](_net_server_rlpxserver_.rlpxserver.md)

# Class: RlpxServer

DevP2P/RLPx server

**`emits`** connected

**`emits`** disconnected

**`emits`** error

**`memberof`** module:net/server

## Hierarchy

↳ [Server](_net_server_server_.server.md)

↳ **RlpxServer**

## Index

### Constructors

- [constructor](_net_server_rlpxserver_.rlpxserver.md#constructor)

### Properties

- [bootnodes](_net_server_rlpxserver_.rlpxserver.md#bootnodes)
- [config](_net_server_rlpxserver_.rlpxserver.md#config)
- [dpt](_net_server_rlpxserver_.rlpxserver.md#dpt)
- [ip](_net_server_rlpxserver_.rlpxserver.md#ip)
- [key](_net_server_rlpxserver_.rlpxserver.md#key)
- [port](_net_server_rlpxserver_.rlpxserver.md#port)
- [rlpx](_net_server_rlpxserver_.rlpxserver.md#rlpx)
- [started](_net_server_rlpxserver_.rlpxserver.md#started)

### Accessors

- [name](_net_server_rlpxserver_.rlpxserver.md#name)
- [running](_net_server_rlpxserver_.rlpxserver.md#running)

### Methods

- [addListener](_net_server_rlpxserver_.rlpxserver.md#addlistener)
- [addProtocols](_net_server_rlpxserver_.rlpxserver.md#addprotocols)
- [ban](_net_server_rlpxserver_.rlpxserver.md#ban)
- [bootstrap](_net_server_rlpxserver_.rlpxserver.md#bootstrap)
- [emit](_net_server_rlpxserver_.rlpxserver.md#emit)
- [error](_net_server_rlpxserver_.rlpxserver.md#private-error)
- [eventNames](_net_server_rlpxserver_.rlpxserver.md#eventnames)
- [getMaxListeners](_net_server_rlpxserver_.rlpxserver.md#getmaxlisteners)
- [getRlpxInfo](_net_server_rlpxserver_.rlpxserver.md#getrlpxinfo)
- [initDpt](_net_server_rlpxserver_.rlpxserver.md#private-initdpt)
- [initRlpx](_net_server_rlpxserver_.rlpxserver.md#private-initrlpx)
- [listenerCount](_net_server_rlpxserver_.rlpxserver.md#listenercount)
- [listeners](_net_server_rlpxserver_.rlpxserver.md#listeners)
- [off](_net_server_rlpxserver_.rlpxserver.md#off)
- [on](_net_server_rlpxserver_.rlpxserver.md#on)
- [once](_net_server_rlpxserver_.rlpxserver.md#once)
- [prependListener](_net_server_rlpxserver_.rlpxserver.md#prependlistener)
- [prependOnceListener](_net_server_rlpxserver_.rlpxserver.md#prependoncelistener)
- [rawListeners](_net_server_rlpxserver_.rlpxserver.md#rawlisteners)
- [removeAllListeners](_net_server_rlpxserver_.rlpxserver.md#removealllisteners)
- [removeListener](_net_server_rlpxserver_.rlpxserver.md#removelistener)
- [setMaxListeners](_net_server_rlpxserver_.rlpxserver.md#setmaxlisteners)
- [start](_net_server_rlpxserver_.rlpxserver.md#start)
- [stop](_net_server_rlpxserver_.rlpxserver.md#stop)

## Constructors

### constructor

\+ **new RlpxServer**(`options`: [RlpxServerOptions](../interfaces/_net_server_rlpxserver_.rlpxserveroptions.md)): _[RlpxServer](_net_server_rlpxserver_.rlpxserver.md)_

_Overrides [Server](_net_server_server_.server.md).[constructor](_net_server_server_.server.md#constructor)_

_Defined in [lib/net/server/rlpxserver.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L45)_

Create new DevP2P/RLPx server

**Parameters:**

| Name      | Type                                                                            |
| --------- | ------------------------------------------------------------------------------- |
| `options` | [RlpxServerOptions](../interfaces/_net_server_rlpxserver_.rlpxserveroptions.md) |

**Returns:** _[RlpxServer](_net_server_rlpxserver_.rlpxserver.md)_

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

### dpt

• **dpt**: _Devp2pDPT | null_ = null

_Defined in [lib/net/server/rlpxserver.ts:44](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L44)_

---

### ip

• **ip**: _string_ = "::"

_Defined in [lib/net/server/rlpxserver.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L45)_

---

### key

• **key**: _Buffer | undefined_

_Inherited from [Server](_net_server_server_.server.md).[key](_net_server_server_.server.md#key)_

_Defined in [lib/net/server/server.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L27)_

---

### port

• **port**: _number_

_Defined in [lib/net/server/rlpxserver.ts:40](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L40)_

---

### rlpx

• **rlpx**: _Devp2pRLPx | null_ = null

_Defined in [lib/net/server/rlpxserver.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L43)_

---

### started

• **started**: _boolean_

_Inherited from [Server](_net_server_server_.server.md).[started](_net_server_server_.server.md#started)_

_Defined in [lib/net/server/server.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L33)_

## Accessors

### name

• **get name**(): _string_

_Overrides [Server](_net_server_server_.server.md).[name](_net_server_server_.server.md#name)_

_Defined in [lib/net/server/rlpxserver.ts:74](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L74)_

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

_Defined in [lib/net/server/rlpxserver.ts:157](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L157)_

Ban peer for a specified time

**Parameters:**

| Name     | Type   | Default | Description |
| -------- | ------ | ------- | ----------- |
| `peerId` | string | -       | id of peer  |
| `maxAge` | number | 60000   | -           |

**Returns:** _boolean_

True if ban was successfully executed

---

### bootstrap

▸ **bootstrap**(): _Promise‹void›_

_Defined in [lib/net/server/rlpxserver.ts:122](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L122)_

Bootstrap bootnode peers from the network

**Returns:** _Promise‹void›_

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

▸ **error**(`error`: Error, `peer?`: [RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)): _void_

_Defined in [lib/net/server/rlpxserver.ts:172](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L172)_

Handles errors from server and peers

**`emits`** error

**Parameters:**

| Name    | Type                                        |
| ------- | ------------------------------------------- |
| `error` | Error                                       |
| `peer?` | [RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md) |

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

### getRlpxInfo

▸ **getRlpxInfo**(): _object | object_

_Defined in [lib/net/server/rlpxserver.ts:81](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L81)_

Return Rlpx info

**Returns:** _object | object_

---

### `Private` initDpt

▸ **initDpt**(): _void_

_Defined in [lib/net/server/rlpxserver.ts:187](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L187)_

Initializes DPT for peer discovery

**Returns:** _void_

---

### `Private` initRlpx

▸ **initRlpx**(): _void_

_Defined in [lib/net/server/rlpxserver.ts:208](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L208)_

Initializes RLPx instance for peer management

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

_Defined in [lib/net/server/rlpxserver.ts:106](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L106)_

Start Devp2p/RLPx server. Returns a promise that resolves once server has been started.

**Returns:** _Promise‹boolean›_

Resolves with true if server successfully started

---

### stop

▸ **stop**(): _Promise‹boolean›_

_Overrides [Server](_net_server_server_.server.md).[stop](_net_server_server_.server.md#stop)_

_Defined in [lib/net/server/rlpxserver.ts:141](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L141)_

Stop Devp2p/RLPx server. Returns a promise that resolves once server has been stopped.

**Returns:** _Promise‹boolean›_

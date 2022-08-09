[ethereumjs-client](../README.md) › ["service/ethereumservice"](../modules/_service_ethereumservice_.md) › [EthereumService](_service_ethereumservice_.ethereumservice.md)

# Class: EthereumService

Ethereum service

**`memberof`** module:service

## Hierarchy

↳ [Service](_service_service_.service.md)

↳ **EthereumService**

↳ [FullEthereumService](_service_fullethereumservice_.fullethereumservice.md)

↳ [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)

## Index

### Constructors

- [constructor](_service_ethereumservice_.ethereumservice.md#constructor)

### Properties

- [chain](_service_ethereumservice_.ethereumservice.md#chain)
- [config](_service_ethereumservice_.ethereumservice.md#config)
- [flow](_service_ethereumservice_.ethereumservice.md#flow)
- [interval](_service_ethereumservice_.ethereumservice.md#interval)
- [opened](_service_ethereumservice_.ethereumservice.md#opened)
- [pool](_service_ethereumservice_.ethereumservice.md#pool)
- [running](_service_ethereumservice_.ethereumservice.md#running)
- [synchronizer](_service_ethereumservice_.ethereumservice.md#synchronizer)
- [timeout](_service_ethereumservice_.ethereumservice.md#timeout)

### Accessors

- [name](_service_ethereumservice_.ethereumservice.md#protected-name)
- [protocols](_service_ethereumservice_.ethereumservice.md#protocols)

### Methods

- [addListener](_service_ethereumservice_.ethereumservice.md#addlistener)
- [close](_service_ethereumservice_.ethereumservice.md#close)
- [emit](_service_ethereumservice_.ethereumservice.md#emit)
- [eventNames](_service_ethereumservice_.ethereumservice.md#eventnames)
- [getMaxListeners](_service_ethereumservice_.ethereumservice.md#getmaxlisteners)
- [handle](_service_ethereumservice_.ethereumservice.md#handle)
- [listenerCount](_service_ethereumservice_.ethereumservice.md#listenercount)
- [listeners](_service_ethereumservice_.ethereumservice.md#listeners)
- [off](_service_ethereumservice_.ethereumservice.md#off)
- [on](_service_ethereumservice_.ethereumservice.md#on)
- [once](_service_ethereumservice_.ethereumservice.md#once)
- [open](_service_ethereumservice_.ethereumservice.md#open)
- [prependListener](_service_ethereumservice_.ethereumservice.md#prependlistener)
- [prependOnceListener](_service_ethereumservice_.ethereumservice.md#prependoncelistener)
- [rawListeners](_service_ethereumservice_.ethereumservice.md#rawlisteners)
- [removeAllListeners](_service_ethereumservice_.ethereumservice.md#removealllisteners)
- [removeListener](_service_ethereumservice_.ethereumservice.md#removelistener)
- [setMaxListeners](_service_ethereumservice_.ethereumservice.md#setmaxlisteners)
- [start](_service_ethereumservice_.ethereumservice.md#start)
- [stop](_service_ethereumservice_.ethereumservice.md#stop)

## Constructors

### constructor

\+ **new EthereumService**(`options`: [EthereumServiceOptions](../interfaces/_service_ethereumservice_.ethereumserviceoptions.md)): _[EthereumService](_service_ethereumservice_.ethereumservice.md)_

_Overrides [Service](_service_service_.service.md).[constructor](_service_service_.service.md#constructor)_

_Defined in [lib/service/ethereumservice.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L30)_

Create new ETH service

**Parameters:**

| Name      | Type                                                                                        |
| --------- | ------------------------------------------------------------------------------------------- |
| `options` | [EthereumServiceOptions](../interfaces/_service_ethereumservice_.ethereumserviceoptions.md) |

**Returns:** _[EthereumService](_service_ethereumservice_.ethereumservice.md)_

## Properties

### chain

• **chain**: _[Chain](_blockchain_chain_.chain.md)_

_Defined in [lib/service/ethereumservice.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L27)_

---

### config

• **config**: _[Config](_config_.config.md)_

_Inherited from [Service](_service_service_.service.md).[config](_service_service_.service.md#config)_

_Defined in [lib/service/service.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L17)_

---

### flow

• **flow**: _[FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)_

_Defined in [lib/service/ethereumservice.ts:26](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L26)_

---

### interval

• **interval**: _number_

_Defined in [lib/service/ethereumservice.ts:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L28)_

---

### opened

• **opened**: _boolean_

_Inherited from [Service](_service_service_.service.md).[opened](_service_service_.service.md#opened)_

_Defined in [lib/service/service.ts:18](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L18)_

---

### pool

• **pool**: _[PeerPool](_net_peerpool_.peerpool.md)_

_Inherited from [Service](_service_service_.service.md).[pool](_service_service_.service.md#pool)_

_Defined in [lib/service/service.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L20)_

---

### running

• **running**: _boolean_

_Inherited from [Service](_service_service_.service.md).[running](_service_service_.service.md#running)_

_Defined in [lib/service/service.ts:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L19)_

---

### synchronizer

• **synchronizer**: _[Synchronizer](_sync_sync_.synchronizer.md)_

_Defined in [lib/service/ethereumservice.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L30)_

---

### timeout

• **timeout**: _number_

_Defined in [lib/service/ethereumservice.ts:29](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L29)_

## Accessors

### `Protected` name

• **get name**(): _string_

_Overrides [Service](_service_service_.service.md).[name](_service_service_.service.md#protected-name)_

_Defined in [lib/service/ethereumservice.ts:50](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L50)_

Service name

**`type`** {string}

**Returns:** _string_

---

### protocols

• **get protocols**(): _[Protocol](_net_protocol_protocol_.protocol.md)[]_

_Inherited from [Service](_service_service_.service.md).[protocols](_service_service_.service.md#protocols)_

_Defined in [lib/service/service.ts:68](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L68)_

Returns all protocols required by this service

**`type`** {Protocol[]} required protocols

**Returns:** _[Protocol](_net_protocol_protocol_.protocol.md)[]_

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

▸ **close**(): _Promise‹void›_

_Inherited from [Service](_service_service_.service.md).[close](_service_service_.service.md#close)_

_Defined in [lib/service/service.ts:96](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L96)_

Close service.

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

### handle

▸ **handle**(`_message`: any, `_protocol`: string, `_peer`: [Peer](_net_peer_peer_.peer.md)): _Promise‹any›_

_Inherited from [Service](_service_service_.service.md).[handle](_service_service_.service.md#handle)_

_Defined in [lib/service/service.ts:136](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L136)_

Handles incoming request from connected peer

**Parameters:**

| Name        | Type                            |
| ----------- | ------------------------------- |
| `_message`  | any                             |
| `_protocol` | string                          |
| `_peer`     | [Peer](_net_peer_peer_.peer.md) |

**Returns:** _Promise‹any›_

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

▸ **open**(): _Promise‹undefined | false›_

_Overrides [Service](_service_service_.service.md).[open](_service_service_.service.md#open)_

_Defined in [lib/service/ethereumservice.ts:58](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L58)_

Open eth service. Must be called before service is started

**Returns:** _Promise‹undefined | false›_

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

▸ **start**(): _Promise‹void | boolean›_

_Overrides [Service](_service_service_.service.md).[start](_service_service_.service.md#start)_

_Defined in [lib/service/ethereumservice.ts:74](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L74)_

Starts service and ensures blockchain is synchronized. Returns a promise
that resolves once the service is started and blockchain is in sync.

**Returns:** _Promise‹void | boolean›_

---

### stop

▸ **stop**(): _Promise‹void | boolean›_

_Overrides [Service](_service_service_.service.md).[stop](_service_service_.service.md#stop)_

_Defined in [lib/service/ethereumservice.ts:86](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L86)_

Stop service. Interrupts blockchain synchronization if its in progress.

**Returns:** _Promise‹void | boolean›_

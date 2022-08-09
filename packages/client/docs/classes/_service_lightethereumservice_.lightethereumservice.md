[ethereumjs-client](../README.md) › ["service/lightethereumservice"](../modules/_service_lightethereumservice_.md) › [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)

# Class: LightEthereumService

Ethereum service

**`memberof`** module:service

## Hierarchy

↳ [EthereumService](_service_ethereumservice_.ethereumservice.md)

↳ **LightEthereumService**

## Index

### Constructors

- [constructor](_service_lightethereumservice_.lightethereumservice.md#constructor)

### Properties

- [chain](_service_lightethereumservice_.lightethereumservice.md#chain)
- [config](_service_lightethereumservice_.lightethereumservice.md#config)
- [flow](_service_lightethereumservice_.lightethereumservice.md#flow)
- [interval](_service_lightethereumservice_.lightethereumservice.md#interval)
- [opened](_service_lightethereumservice_.lightethereumservice.md#opened)
- [pool](_service_lightethereumservice_.lightethereumservice.md#pool)
- [running](_service_lightethereumservice_.lightethereumservice.md#running)
- [synchronizer](_service_lightethereumservice_.lightethereumservice.md#synchronizer)
- [timeout](_service_lightethereumservice_.lightethereumservice.md#timeout)

### Accessors

- [name](_service_lightethereumservice_.lightethereumservice.md#protected-name)
- [protocols](_service_lightethereumservice_.lightethereumservice.md#protocols)

### Methods

- [addListener](_service_lightethereumservice_.lightethereumservice.md#addlistener)
- [close](_service_lightethereumservice_.lightethereumservice.md#close)
- [emit](_service_lightethereumservice_.lightethereumservice.md#emit)
- [eventNames](_service_lightethereumservice_.lightethereumservice.md#eventnames)
- [getMaxListeners](_service_lightethereumservice_.lightethereumservice.md#getmaxlisteners)
- [handle](_service_lightethereumservice_.lightethereumservice.md#handle)
- [listenerCount](_service_lightethereumservice_.lightethereumservice.md#listenercount)
- [listeners](_service_lightethereumservice_.lightethereumservice.md#listeners)
- [off](_service_lightethereumservice_.lightethereumservice.md#off)
- [on](_service_lightethereumservice_.lightethereumservice.md#on)
- [once](_service_lightethereumservice_.lightethereumservice.md#once)
- [open](_service_lightethereumservice_.lightethereumservice.md#open)
- [prependListener](_service_lightethereumservice_.lightethereumservice.md#prependlistener)
- [prependOnceListener](_service_lightethereumservice_.lightethereumservice.md#prependoncelistener)
- [rawListeners](_service_lightethereumservice_.lightethereumservice.md#rawlisteners)
- [removeAllListeners](_service_lightethereumservice_.lightethereumservice.md#removealllisteners)
- [removeListener](_service_lightethereumservice_.lightethereumservice.md#removelistener)
- [setMaxListeners](_service_lightethereumservice_.lightethereumservice.md#setmaxlisteners)
- [start](_service_lightethereumservice_.lightethereumservice.md#start)
- [stop](_service_lightethereumservice_.lightethereumservice.md#stop)

## Constructors

### constructor

\+ **new LightEthereumService**(`options`: [EthereumServiceOptions](../interfaces/_service_ethereumservice_.ethereumserviceoptions.md)): _[LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)_

_Overrides [EthereumService](_service_ethereumservice_.ethereumservice.md).[constructor](_service_ethereumservice_.ethereumservice.md#constructor)_

_Defined in [lib/service/lightethereumservice.ts:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/lightethereumservice.ts#L11)_

Create new ETH service

**Parameters:**

| Name      | Type                                                                                        | Description            |
| --------- | ------------------------------------------------------------------------------------------- | ---------------------- |
| `options` | [EthereumServiceOptions](../interfaces/_service_ethereumservice_.ethereumserviceoptions.md) | constructor parameters |

**Returns:** _[LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)_

## Properties

### chain

• **chain**: _[Chain](_blockchain_chain_.chain.md)_

_Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[chain](_service_ethereumservice_.ethereumservice.md#chain)_

_Defined in [lib/service/ethereumservice.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L27)_

---

### config

• **config**: _[Config](_config_.config.md)_

_Inherited from [Service](_service_service_.service.md).[config](_service_service_.service.md#config)_

_Defined in [lib/service/service.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L17)_

---

### flow

• **flow**: _[FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)_

_Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[flow](_service_ethereumservice_.ethereumservice.md#flow)_

_Defined in [lib/service/ethereumservice.ts:26](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L26)_

---

### interval

• **interval**: _number_

_Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[interval](_service_ethereumservice_.ethereumservice.md#interval)_

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

• **synchronizer**: _[LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)_

_Overrides [EthereumService](_service_ethereumservice_.ethereumservice.md).[synchronizer](_service_ethereumservice_.ethereumservice.md#synchronizer)_

_Defined in [lib/service/lightethereumservice.ts:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/lightethereumservice.ts#L11)_

---

### timeout

• **timeout**: _number_

_Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[timeout](_service_ethereumservice_.ethereumservice.md#timeout)_

_Defined in [lib/service/ethereumservice.ts:29](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L29)_

## Accessors

### `Protected` name

• **get name**(): _string_

_Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[name](_service_ethereumservice_.ethereumservice.md#protected-name)_

_Overrides [Service](_service_service_.service.md).[name](_service_service_.service.md#protected-name)_

_Defined in [lib/service/ethereumservice.ts:50](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L50)_

Service name

**`type`** {string}

**Returns:** _string_

---

### protocols

• **get protocols**(): _[LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)[]_

_Overrides [Service](_service_service_.service.md).[protocols](_service_service_.service.md#protocols)_

_Defined in [lib/service/lightethereumservice.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/lightethereumservice.ts#L33)_

Returns all protocols required by this service

**Returns:** _[LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)[]_

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

▸ **handle**(`_message`: any, `_protocol`: string, `_peer`: [Peer](_net_peer_peer_.peer.md)): _Promise‹void›_

_Overrides [Service](_service_service_.service.md).[handle](_service_service_.service.md#handle)_

_Defined in [lib/service/lightethereumservice.ts:44](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/lightethereumservice.ts#L44)_

Handles incoming message from connected peer

**Parameters:**

| Name        | Type                            |
| ----------- | ------------------------------- |
| `_message`  | any                             |
| `_protocol` | string                          |
| `_peer`     | [Peer](_net_peer_peer_.peer.md) |

**Returns:** _Promise‹void›_

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

_Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[open](_service_ethereumservice_.ethereumservice.md#open)_

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

_Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[start](_service_ethereumservice_.ethereumservice.md#start)_

_Overrides [Service](_service_service_.service.md).[start](_service_service_.service.md#start)_

_Defined in [lib/service/ethereumservice.ts:74](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L74)_

Starts service and ensures blockchain is synchronized. Returns a promise
that resolves once the service is started and blockchain is in sync.

**Returns:** _Promise‹void | boolean›_

---

### stop

▸ **stop**(): _Promise‹void | boolean›_

_Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[stop](_service_ethereumservice_.ethereumservice.md#stop)_

_Overrides [Service](_service_service_.service.md).[stop](_service_service_.service.md#stop)_

_Defined in [lib/service/ethereumservice.ts:86](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.ts#L86)_

Stop service. Interrupts blockchain synchronization if its in progress.

**Returns:** _Promise‹void | boolean›_

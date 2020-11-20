[ethereumjs-client](../README.md) › ["service/service"](../modules/_service_service_.md) › [Service](_service_service_.service.md)

# Class: Service

Base class for all services

**`memberof`** module:service

## Hierarchy

* EventEmitter

  ↳ **Service**

  ↳ [EthereumService](_service_ethereumservice_.ethereumservice.md)

## Index

### Constructors

* [constructor](_service_service_.service.md#constructor)

### Properties

* [config](_service_service_.service.md#config)
* [opened](_service_service_.service.md#opened)
* [pool](_service_service_.service.md#pool)
* [running](_service_service_.service.md#running)
* [defaultMaxListeners](_service_service_.service.md#static-defaultmaxlisteners)
* [errorMonitor](_service_service_.service.md#static-errormonitor)

### Accessors

* [name](_service_service_.service.md#protected-name)
* [protocols](_service_service_.service.md#protocols)

### Methods

* [addListener](_service_service_.service.md#addlistener)
* [close](_service_service_.service.md#close)
* [emit](_service_service_.service.md#emit)
* [eventNames](_service_service_.service.md#eventnames)
* [getMaxListeners](_service_service_.service.md#getmaxlisteners)
* [handle](_service_service_.service.md#handle)
* [listenerCount](_service_service_.service.md#listenercount)
* [listeners](_service_service_.service.md#listeners)
* [off](_service_service_.service.md#off)
* [on](_service_service_.service.md#on)
* [once](_service_service_.service.md#once)
* [open](_service_service_.service.md#open)
* [prependListener](_service_service_.service.md#prependlistener)
* [prependOnceListener](_service_service_.service.md#prependoncelistener)
* [rawListeners](_service_service_.service.md#rawlisteners)
* [removeAllListeners](_service_service_.service.md#removealllisteners)
* [removeListener](_service_service_.service.md#removelistener)
* [setMaxListeners](_service_service_.service.md#setmaxlisteners)
* [start](_service_service_.service.md#start)
* [stop](_service_service_.service.md#stop)
* [listenerCount](_service_service_.service.md#static-listenercount)

## Constructors

###  constructor

\+ **new Service**(`options`: [ServiceOptions](../interfaces/_service_service_.serviceoptions.md)): *[Service](_service_service_.service.md)*

*Overrides void*

*Defined in [lib/service/service.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L20)*

Create new service and associated peer pool

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ServiceOptions](../interfaces/_service_service_.serviceoptions.md) |

**Returns:** *[Service](_service_service_.service.md)*

## Properties

###  config

• **config**: *[Config](_config_.config.md)*

*Defined in [lib/service/service.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L17)*

___

###  opened

• **opened**: *boolean*

*Defined in [lib/service/service.ts:18](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L18)*

___

###  pool

• **pool**: *[PeerPool](_net_peerpool_.peerpool.md)*

*Defined in [lib/service/service.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L20)*

___

###  running

• **running**: *boolean*

*Defined in [lib/service/service.ts:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L19)*

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

### `Protected` name

• **get name**(): *any*

*Defined in [lib/service/service.ts:59](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L59)*

Service name

**`type`** {string}

**Returns:** *any*

___

###  protocols

• **get protocols**(): *[Protocol](_net_protocol_protocol_.protocol.md)[]*

*Defined in [lib/service/service.ts:68](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L68)*

Returns all protocols required by this service

**`type`** {Protocol[]} required protocols

**Returns:** *[Protocol](_net_protocol_protocol_.protocol.md)[]*

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

▸ **close**(): *Promise‹void›*

*Defined in [lib/service/service.ts:96](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L96)*

Close service.

**Returns:** *Promise‹void›*

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

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:69

**Returns:** *number*

___

###  handle

▸ **handle**(`_message`: any, `_protocol`: string, `_peer`: [Peer](_net_peer_peer_.peer.md)): *Promise‹any›*

*Defined in [lib/service/service.ts:136](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L136)*

Handles incoming request from connected peer

**Parameters:**

Name | Type |
------ | ------ |
`_message` | any |
`_protocol` | string |
`_peer` | [Peer](_net_peer_peer_.peer.md) |

**Returns:** *Promise‹any›*

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

▸ **open**(): *Promise‹undefined | false›*

*Defined in [lib/service/service.ts:76](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L76)*

Open service. Must be called before service is running

**Returns:** *Promise‹undefined | false›*

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

###  start

▸ **start**(): *Promise‹void | boolean›*

*Defined in [lib/service/service.ts:108](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L108)*

Start service

**Returns:** *Promise‹void | boolean›*

___

###  stop

▸ **stop**(): *Promise‹void | boolean›*

*Defined in [lib/service/service.ts:121](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L121)*

Stop service

**Returns:** *Promise‹void | boolean›*

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

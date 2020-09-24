[ethereumjs-client](../README.md) › ["service/fastethereumservice"](../modules/_service_fastethereumservice_.md) › [FastEthereumService](_service_fastethereumservice_.fastethereumservice.md)

# Class: FastEthereumService

Ethereum service

**`memberof`** module:service

## Hierarchy

  ↳ [EthereumService](_service_ethereumservice_.ethereumservice.md)

  ↳ **FastEthereumService**

## Index

### Constructors

* [constructor](_service_fastethereumservice_.fastethereumservice.md#constructor)

### Accessors

* [protocols](_service_fastethereumservice_.fastethereumservice.md#protocols)

### Methods

* [close](_service_fastethereumservice_.fastethereumservice.md#close)
* [handle](_service_fastethereumservice_.fastethereumservice.md#handle)
* [handleEth](_service_fastethereumservice_.fastethereumservice.md#handleeth)
* [handleLes](_service_fastethereumservice_.fastethereumservice.md#handleles)
* [init](_service_fastethereumservice_.fastethereumservice.md#init)
* [open](_service_fastethereumservice_.fastethereumservice.md#open)
* [start](_service_fastethereumservice_.fastethereumservice.md#start)
* [stop](_service_fastethereumservice_.fastethereumservice.md#stop)

## Constructors

###  constructor

\+ **new FastEthereumService**(`options`: object): *[FastEthereumService](_service_fastethereumservice_.fastethereumservice.md)*

*Overrides [EthereumService](_service_ethereumservice_.ethereumservice.md).[constructor](_service_ethereumservice_.ethereumservice.md#constructor)*

*Defined in [lib/service/fastethereumservice.js:16](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/fastethereumservice.js#L16)*

Create new ETH service

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[FastEthereumService](_service_fastethereumservice_.fastethereumservice.md)*

## Accessors

###  protocols

• **get protocols**(): *any[]*

*Overrides [Service](_service_service_.service.md).[protocols](_service_service_.service.md#protocols)*

*Defined in [lib/service/fastethereumservice.js:52](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/fastethereumservice.js#L52)*

Returns all protocols required by this service

**`type`** {Protocol[]} required protocols

**Returns:** *any[]*

## Methods

###  close

▸ **close**(): *Promise‹any›*

*Inherited from [Service](_service_service_.service.md).[close](_service_service_.service.md#close)*

*Defined in [lib/service/service.js:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.js#L90)*

Close service.

**Returns:** *Promise‹any›*

___

###  handle

▸ **handle**(`message`: Object, `protocol`: string, `peer`: any): *Promise‹any›*

*Overrides [Service](_service_service_.service.md).[handle](_service_service_.service.md#handle)*

*Defined in [lib/service/fastethereumservice.js:74](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/fastethereumservice.js#L74)*

Handles incoming message from connected peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Object | message object |
`protocol` | string | protocol name |
`peer` | any | peer |

**Returns:** *Promise‹any›*

___

###  handleEth

▸ **handleEth**(`message`: Object, `peer`: any): *Promise‹any›*

*Defined in [lib/service/fastethereumservice.js:88](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/fastethereumservice.js#L88)*

Handles incoming ETH message from connected peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Object | message object |
`peer` | any | peer |

**Returns:** *Promise‹any›*

___

###  handleLes

▸ **handleLes**(`message`: Object, `peer`: any): *Promise‹any›*

*Defined in [lib/service/fastethereumservice.js:109](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/fastethereumservice.js#L109)*

Handles incoming LES message from connected peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Object | message object |
`peer` | any | peer |

**Returns:** *Promise‹any›*

___

###  init

▸ **init**(): *void*

*Defined in [lib/service/fastethereumservice.js:36](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/fastethereumservice.js#L36)*

**Returns:** *void*

___

###  open

▸ **open**(): *Promise‹any›*

*Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[open](_service_ethereumservice_.ethereumservice.md#open)*

*Overrides [Service](_service_service_.service.md).[open](_service_service_.service.md#open)*

*Defined in [lib/service/ethereumservice.js:60](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L60)*

Open eth service. Must be called before service is started

**Returns:** *Promise‹any›*

___

###  start

▸ **start**(): *Promise‹any›*

*Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[start](_service_ethereumservice_.ethereumservice.md#start)*

*Overrides [Service](_service_service_.service.md).[start](_service_service_.service.md#start)*

*Defined in [lib/service/ethereumservice.js:76](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L76)*

Starts service and ensures blockchain is synchronized. Returns a promise
that resolves once the service is started and blockchain is in sync.

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *Promise‹any›*

*Inherited from [EthereumService](_service_ethereumservice_.ethereumservice.md).[stop](_service_ethereumservice_.ethereumservice.md#stop)*

*Overrides [Service](_service_service_.service.md).[stop](_service_service_.service.md#stop)*

*Defined in [lib/service/ethereumservice.js:88](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L88)*

Stop service. Interrupts blockchain synchronization if its in progress.

**Returns:** *Promise‹any›*

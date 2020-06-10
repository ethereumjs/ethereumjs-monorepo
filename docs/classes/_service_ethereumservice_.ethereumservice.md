[ethereumjs-client](../README.md) › ["service/ethereumservice"](../modules/_service_ethereumservice_.md) › [EthereumService](_service_ethereumservice_.ethereumservice.md)

# Class: EthereumService

Ethereum service

**`memberof`** module:service

## Hierarchy

  ↳ [Service](_service_service_.service.md)

  ↳ **EthereumService**

  ↳ [FastEthereumService](_service_fastethereumservice_.fastethereumservice.md)

  ↳ [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)

## Index

### Constructors

* [constructor](_service_ethereumservice_.ethereumservice.md#constructor)

### Accessors

* [protocols](_service_ethereumservice_.ethereumservice.md#protocols)

### Methods

* [close](_service_ethereumservice_.ethereumservice.md#close)
* [handle](_service_ethereumservice_.ethereumservice.md#handle)
* [open](_service_ethereumservice_.ethereumservice.md#open)
* [start](_service_ethereumservice_.ethereumservice.md#start)
* [stop](_service_ethereumservice_.ethereumservice.md#stop)

## Constructors

###  constructor

\+ **new EthereumService**(`options`: object): *[EthereumService](_service_ethereumservice_.ethereumservice.md)*

*Overrides [Service](_service_service_.service.md).[constructor](_service_service_.service.md#constructor)*

*Defined in [lib/service/ethereumservice.js:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L20)*

Create new ETH service

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[EthereumService](_service_ethereumservice_.ethereumservice.md)*

## Accessors

###  protocols

• **get protocols**(): *any[]*

*Inherited from [Service](_service_service_.service.md).[protocols](_service_service_.service.md#protocols)*

*Defined in [lib/service/service.js:62](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.js#L62)*

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

*Inherited from [Service](_service_service_.service.md).[handle](_service_service_.service.md#handle)*

*Defined in [lib/service/service.js:127](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.js#L127)*

Handles incoming request from connected peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Object | message object |
`protocol` | string | protocol name |
`peer` | any | peer |

**Returns:** *Promise‹any›*

___

###  open

▸ **open**(): *Promise‹any›*

*Overrides [Service](_service_service_.service.md).[open](_service_service_.service.md#open)*

*Defined in [lib/service/ethereumservice.js:60](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L60)*

Open eth service. Must be called before service is started

**Returns:** *Promise‹any›*

___

###  start

▸ **start**(): *Promise‹any›*

*Overrides [Service](_service_service_.service.md).[start](_service_service_.service.md#start)*

*Defined in [lib/service/ethereumservice.js:76](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L76)*

Starts service and ensures blockchain is synchronized. Returns a promise
that resolves once the service is started and blockchain is in sync.

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *Promise‹any›*

*Overrides [Service](_service_service_.service.md).[stop](_service_service_.service.md#stop)*

*Defined in [lib/service/ethereumservice.js:88](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L88)*

Stop service. Interrupts blockchain synchronization if its in progress.

**Returns:** *Promise‹any›*

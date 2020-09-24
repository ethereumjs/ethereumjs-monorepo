[ethereumjs-client](../README.md) › ["service/lightethereumservice"](../modules/_service_lightethereumservice_.md) › [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)

# Class: LightEthereumService

Ethereum service

**`memberof`** module:service

## Hierarchy

  ↳ [EthereumService](_service_ethereumservice_.ethereumservice.md)

  ↳ **LightEthereumService**

## Index

### Constructors

* [constructor](_service_lightethereumservice_.lightethereumservice.md#constructor)

### Accessors

* [protocols](_service_lightethereumservice_.lightethereumservice.md#protocols)

### Methods

* [close](_service_lightethereumservice_.lightethereumservice.md#close)
* [handle](_service_lightethereumservice_.lightethereumservice.md#handle)
* [init](_service_lightethereumservice_.lightethereumservice.md#init)
* [open](_service_lightethereumservice_.lightethereumservice.md#open)
* [start](_service_lightethereumservice_.lightethereumservice.md#start)
* [stop](_service_lightethereumservice_.lightethereumservice.md#stop)

## Constructors

###  constructor

\+ **new LightEthereumService**(`options`: object): *[LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)*

*Overrides [EthereumService](_service_ethereumservice_.ethereumservice.md).[constructor](_service_ethereumservice_.ethereumservice.md#constructor)*

*Defined in [lib/service/lightethereumservice.js:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/lightethereumservice.js#L11)*

Create new ETH service

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)*

## Accessors

###  protocols

• **get protocols**(): *any[]*

*Overrides [Service](_service_service_.service.md).[protocols](_service_service_.service.md#protocols)*

*Defined in [lib/service/lightethereumservice.js:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/lightethereumservice.js#L45)*

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

*Defined in [lib/service/lightethereumservice.js:56](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/lightethereumservice.js#L56)*

Handles incoming message from connected peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Object | message object |
`protocol` | string | protocol name |
`peer` | any | peer |

**Returns:** *Promise‹any›*

___

###  init

▸ **init**(): *void*

*Defined in [lib/service/lightethereumservice.js:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/lightethereumservice.js#L28)*

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

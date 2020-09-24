[ethereumjs-client](../README.md) › ["service/service"](../modules/_service_service_.md) › [Service](_service_service_.service.md)

# Class: Service

Base class for all services

**`memberof`** module:service

## Hierarchy

* any

  ↳ **Service**

  ↳ [EthereumService](_service_ethereumservice_.ethereumservice.md)

## Index

### Constructors

* [constructor](_service_service_.service.md#constructor)

### Accessors

* [protocols](_service_service_.service.md#protocols)

### Methods

* [close](_service_service_.service.md#close)
* [handle](_service_service_.service.md#handle)
* [open](_service_service_.service.md#open)
* [start](_service_service_.service.md#start)
* [stop](_service_service_.service.md#stop)

## Constructors

###  constructor

\+ **new Service**(`options`: object): *[Service](_service_service_.service.md)*

*Defined in [lib/service/service.js:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.js#L17)*

Create new service and associated peer pool

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[Service](_service_service_.service.md)*

## Accessors

###  protocols

• **get protocols**(): *any[]*

*Defined in [lib/service/service.js:62](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.js#L62)*

Returns all protocols required by this service

**`type`** {Protocol[]} required protocols

**Returns:** *any[]*

## Methods

###  close

▸ **close**(): *Promise‹any›*

*Defined in [lib/service/service.js:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.js#L90)*

Close service.

**Returns:** *Promise‹any›*

___

###  handle

▸ **handle**(`message`: Object, `protocol`: string, `peer`: any): *Promise‹any›*

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

*Defined in [lib/service/service.js:70](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.js#L70)*

Open service. Must be called before service is running

**Returns:** *Promise‹any›*

___

###  start

▸ **start**(): *Promise‹any›*

*Defined in [lib/service/service.js:102](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.js#L102)*

Start service

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *Promise‹any›*

*Defined in [lib/service/service.js:115](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.js#L115)*

Start service

**Returns:** *Promise‹any›*

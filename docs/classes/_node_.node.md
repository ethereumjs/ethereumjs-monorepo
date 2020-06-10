[ethereumjs-client](../README.md) › ["node"](../modules/_node_.md) › [Node](_node_.node.md)

# Class: Node

Represents the top-level ethereum node, and is responsible for managing the
lifecycle of included services.

**`memberof`** module:node

## Hierarchy

* any

  ↳ **Node**

## Index

### Constructors

* [constructor](_node_.node.md#constructor)

### Methods

* [open](_node_.node.md#open)
* [server](_node_.node.md#server)
* [service](_node_.node.md#service)
* [start](_node_.node.md#start)
* [stop](_node_.node.md#stop)

## Constructors

###  constructor

\+ **new Node**(`options`: object): *[Node](_node_.node.md)*

*Defined in [lib/node.js:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.js#L19)*

Create new node

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[Node](_node_.node.md)*

## Methods

###  open

▸ **open**(): *Promise‹any›*

*Defined in [lib/node.js:71](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.js#L71)*

Open node. Must be called before node is started

**Returns:** *Promise‹any›*

___

###  server

▸ **server**(`name`: string): *any*

*Defined in [lib/node.js:135](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.js#L135)*

Returns the server with the specified name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | name of server |

**Returns:** *any*

___

###  service

▸ **service**(`name`: string): *any*

*Defined in [lib/node.js:126](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.js#L126)*

Returns the service with the specified name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | name of service |

**Returns:** *any*

___

###  start

▸ **start**(): *Promise‹any›*

*Defined in [lib/node.js:99](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.js#L99)*

Starts node and all services and network servers.

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *Promise‹any›*

*Defined in [lib/node.js:112](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.js#L112)*

Stops node and all services and network servers.

**Returns:** *Promise‹any›*

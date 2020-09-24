[ethereumjs-client](../README.md) › ["service/ethereumservice"](_service_ethereumservice_.md)

# Module: "service/ethereumservice"

## Index

### Classes

* [EthereumService](../classes/_service_ethereumservice_.ethereumservice.md)

### Variables

* [Chain](_service_ethereumservice_.md#chain)
* [Common](_service_ethereumservice_.md#const-common)
* [FlowControl](_service_ethereumservice_.md#const-flowcontrol)
* [Service](_service_ethereumservice_.md#const-service)

### Object literals

* [defaultOptions](_service_ethereumservice_.md#const-defaultoptions)

## Variables

###  Chain

• **Chain**: *[Chain](../classes/_blockchain_chain_.chain.md)*

*Defined in [lib/service/ethereumservice.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L5)*

___

### `Const` Common

• **Common**: *Common* = require('ethereumjs-common').default

*Defined in [lib/service/ethereumservice.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L6)*

___

### `Const` FlowControl

• **FlowControl**: *[FlowControl](../classes/_net_protocol_flowcontrol_.flowcontrol.md)* = require('../net/protocol/flowcontrol')

*Defined in [lib/service/ethereumservice.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L4)*

___

### `Const` Service

• **Service**: *[Service](../classes/_service_service_.service.md)* = require('./service')

*Defined in [lib/service/ethereumservice.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L3)*

## Object literals

### `Const` defaultOptions

### ▪ **defaultOptions**: *object*

*Defined in [lib/service/ethereumservice.js:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L8)*

###  common

• **common**: *Common‹›* = new Common('mainnet', 'chainstart')

*Defined in [lib/service/ethereumservice.js:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L10)*

###  interval

• **interval**: *number* = 1000

*Defined in [lib/service/ethereumservice.js:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L13)*

###  lightserv

• **lightserv**: *boolean* = false

*Defined in [lib/service/ethereumservice.js:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L9)*

###  minPeers

• **minPeers**: *number* = 3

*Defined in [lib/service/ethereumservice.js:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L11)*

###  timeout

• **timeout**: *number* = 5000

*Defined in [lib/service/ethereumservice.js:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/ethereumservice.js#L12)*

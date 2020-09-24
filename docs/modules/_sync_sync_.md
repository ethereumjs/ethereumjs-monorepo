[ethereumjs-client](../README.md) › ["sync/sync"](_sync_sync_.md)

# Module: "sync/sync"

## Index

### Classes

* [Synchronizer](../classes/_sync_sync_.synchronizer.md)

### Variables

* [Common](_sync_sync_.md#const-common)
* [EventEmitter](_sync_sync_.md#const-eventemitter)
* [defaultLogger](_sync_sync_.md#defaultlogger)

### Object literals

* [defaultOptions](_sync_sync_.md#const-defaultoptions)

## Variables

### `Const` Common

• **Common**: *Common* = require('ethereumjs-common').default

*Defined in [lib/sync/sync.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L3)*

___

### `Const` EventEmitter

• **EventEmitter**: *[EventEmitter](_net_peer_peer_.md#const-eventemitter)* = require('events')

*Defined in [lib/sync/sync.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L4)*

___

###  defaultLogger

• **defaultLogger**: *Logger‹›*

*Defined in [lib/sync/sync.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L5)*

## Object literals

### `Const` defaultOptions

### ▪ **defaultOptions**: *object*

*Defined in [lib/sync/sync.js:7](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L7)*

###  common

• **common**: *Common‹›* = new Common('mainnet', 'chainstart')

*Defined in [lib/sync/sync.js:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L8)*

###  interval

• **interval**: *number* = 1000

*Defined in [lib/sync/sync.js:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L10)*

###  logger

• **logger**: *Logger‹›* = defaultLogger

*Defined in [lib/sync/sync.js:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L9)*

###  minPeers

• **minPeers**: *number* = 3

*Defined in [lib/sync/sync.js:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L11)*

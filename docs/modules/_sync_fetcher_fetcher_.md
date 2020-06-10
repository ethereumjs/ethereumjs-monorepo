[ethereumjs-client](../README.md) › ["sync/fetcher/fetcher"](_sync_fetcher_fetcher_.md)

# Module: "sync/fetcher/fetcher"

## Index

### Classes

* [Fetcher](../classes/_sync_fetcher_fetcher_.fetcher.md)

### Variables

* [Common](_sync_fetcher_fetcher_.md#const-common)
* [Heap](_sync_fetcher_fetcher_.md#const-heap)
* [Readable](_sync_fetcher_fetcher_.md#readable)
* [Writable](_sync_fetcher_fetcher_.md#writable)
* [defaultLogger](_sync_fetcher_fetcher_.md#defaultlogger)

### Object literals

* [defaultOptions](_sync_fetcher_fetcher_.md#const-defaultoptions)

## Variables

### `Const` Common

• **Common**: *Common* = require('ethereumjs-common').default

*Defined in [lib/sync/fetcher/fetcher.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L5)*

___

### `Const` Heap

• **Heap**: *any* = require('qheap')

*Defined in [lib/sync/fetcher/fetcher.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L4)*

___

###  Readable

• **Readable**: *Readable*

*Defined in [lib/sync/fetcher/fetcher.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L3)*

___

###  Writable

• **Writable**: *Writable*

*Defined in [lib/sync/fetcher/fetcher.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L3)*

___

###  defaultLogger

• **defaultLogger**: *Logger‹›*

*Defined in [lib/sync/fetcher/fetcher.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L6)*

## Object literals

### `Const` defaultOptions

### ▪ **defaultOptions**: *object*

*Defined in [lib/sync/fetcher/fetcher.js:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L8)*

###  banTime

• **banTime**: *number* = 60000

*Defined in [lib/sync/fetcher/fetcher.js:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L13)*

###  common

• **common**: *Common‹›* = new Common('mainnet', 'chainstart')

*Defined in [lib/sync/fetcher/fetcher.js:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L9)*

###  interval

• **interval**: *number* = 1000

*Defined in [lib/sync/fetcher/fetcher.js:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L12)*

###  logger

• **logger**: *Logger‹›* = defaultLogger

*Defined in [lib/sync/fetcher/fetcher.js:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L10)*

###  maxPerRequest

• **maxPerRequest**: *number* = 128

*Defined in [lib/sync/fetcher/fetcher.js:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L15)*

###  maxQueue

• **maxQueue**: *number* = 16

*Defined in [lib/sync/fetcher/fetcher.js:14](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L14)*

###  timeout

• **timeout**: *number* = 5000

*Defined in [lib/sync/fetcher/fetcher.js:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L11)*

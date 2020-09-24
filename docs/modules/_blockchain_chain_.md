[ethereumjs-client](../README.md) › ["blockchain/chain"](_blockchain_chain_.md)

# Module: "blockchain/chain"

## Index

### Classes

* [Chain](../classes/_blockchain_chain_.chain.md)

### Variables

* [BN](_blockchain_chain_.md#bn)
* [Block](_blockchain_chain_.md#const-block)
* [Blockchain](_blockchain_chain_.md#const-blockchain)
* [Common](_blockchain_chain_.md#const-common)
* [EventEmitter](_blockchain_chain_.md#const-eventemitter)
* [defaultLogger](_blockchain_chain_.md#defaultlogger)
* [promisify](_blockchain_chain_.md#const-promisify)

### Functions

* [hexToBuffer](_blockchain_chain_.md#hextobuffer)

### Object literals

* [defaultOptions](_blockchain_chain_.md#const-defaultoptions)

## Variables

###  BN

• **BN**: *[BN](_blockchain_chain_.md#bn)*

*Defined in [lib/blockchain/chain.js:7](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L7)*

___

### `Const` Block

• **Block**: *any* = require('ethereumjs-block')

*Defined in [lib/blockchain/chain.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L5)*

___

### `Const` Blockchain

• **Blockchain**: *any* = require('ethereumjs-blockchain')

*Defined in [lib/blockchain/chain.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L6)*

___

### `Const` Common

• **Common**: *Common* = require('ethereumjs-common').default

*Defined in [lib/blockchain/chain.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L4)*

___

### `Const` EventEmitter

• **EventEmitter**: *[EventEmitter](_net_peer_peer_.md#const-eventemitter)* = require('events')

*Defined in [lib/blockchain/chain.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L3)*

___

###  defaultLogger

• **defaultLogger**: *Logger‹›*

*Defined in [lib/blockchain/chain.js:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L8)*

___

### `Const` promisify

• **promisify**: *any* = require('util-promisify')

*Defined in [lib/blockchain/chain.js:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L9)*

## Functions

###  hexToBuffer

▸ **hexToBuffer**(`hexString`: any): *any*

*Defined in [lib/blockchain/chain.js:291](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L291)*

**Parameters:**

Name | Type |
------ | ------ |
`hexString` | any |

**Returns:** *any*

## Object literals

### `Const` defaultOptions

### ▪ **defaultOptions**: *object*

*Defined in [lib/blockchain/chain.js:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L11)*

###  common

• **common**: *Common‹›* = new Common('mainnet', 'chainstart')

*Defined in [lib/blockchain/chain.js:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L13)*

###  logger

• **logger**: *Logger‹›* = defaultLogger

*Defined in [lib/blockchain/chain.js:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.js#L12)*

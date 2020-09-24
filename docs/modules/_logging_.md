[ethereumjs-client](../README.md) › ["logging"](_logging_.md)

# Module: "logging"

## Index

### Variables

* [chalk](_logging_.md#const-chalk)
* [combine](_logging_.md#combine)
* [createLogger](_logging_.md#createlogger)
* [errorFormat](_logging_.md#const-errorformat)
* [format](_logging_.md#format)
* [label](_logging_.md#label)
* [printf](_logging_.md#printf)
* [timestamp](_logging_.md#timestamp)
* [transports](_logging_.md#transports)
* [winston](_logging_.md#const-winston)

### Functions

* [getLogger](_logging_.md#getlogger)
* [logFormat](_logging_.md#logformat)

### Object literals

* [levelColors](_logging_.md#const-levelcolors)

## Variables

### `Const` chalk

• **chalk**: *"/Users/ryanghods/dev/ethereumjs-client/node_modules/chalk/types/index"* = require('chalk')

*Defined in [lib/logging.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L3)*

___

###  combine

• **combine**: *combine*

*Defined in [lib/logging.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L6)*

___

###  createLogger

• **createLogger**: *function*

*Defined in [lib/logging.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L5)*

#### Type declaration:

▸ (`options?`: LoggerOptions): *Logger*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | LoggerOptions |

___

### `Const` errorFormat

• **errorFormat**: *function* = format(info => {
  if (info.message instanceof Error && info.message.stack) {
    info.message = info.message.stack
  }
  if (info instanceof Error && info.stack) {
    return Object.assign({}, info, { message: info.stack })
  }
  return info
})

*Defined in [lib/logging.js:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L15)*

#### Type declaration:

▸ (`opts?`: any): *Format*

**Parameters:**

Name | Type |
------ | ------ |
`opts?` | any |

___

###  format

• **format**: *format*

*Defined in [lib/logging.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L5)*

___

###  label

• **label**: *label*

*Defined in [lib/logging.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L6)*

___

###  printf

• **printf**: *printf*

*Defined in [lib/logging.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L6)*

___

###  timestamp

• **timestamp**: *timestamp*

*Defined in [lib/logging.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L6)*

___

###  transports

• **transports**: *Transports*

*Defined in [lib/logging.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L5)*

___

### `Const` winston

• **winston**: *[winston](_logging_.md#const-winston)* = require('winston')

*Defined in [lib/logging.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L4)*

## Functions

###  getLogger

▸ **getLogger**(`options`: object): *Logger‹›*

*Defined in [lib/logging.js:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L35)*

**Parameters:**

▪`Default value`  **options**: *object*= { loglevel: 'info' }

Name | Type | Default |
------ | ------ | ------ |
`loglevel` | string | "info" |

**Returns:** *Logger‹›*

___

###  logFormat

▸ **logFormat**(): *Format‹›*

*Defined in [lib/logging.js:25](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L25)*

**Returns:** *Format‹›*

## Object literals

### `Const` levelColors

### ▪ **levelColors**: *object*

*Defined in [lib/logging.js:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L8)*

###  debug

• **debug**: *string* = "white"

*Defined in [lib/logging.js:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L12)*

###  error

• **error**: *string* = "red"

*Defined in [lib/logging.js:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L9)*

###  info

• **info**: *string* = "green"

*Defined in [lib/logging.js:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L11)*

###  warn

• **warn**: *string* = "yellow"

*Defined in [lib/logging.js:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.js#L10)*

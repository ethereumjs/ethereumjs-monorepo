[ethereumjs-client](../README.md) › ["logging"](_logging_.md)

# Module: "logging"

## Index

### Type aliases

* [Logger](_logging_.md#logger)

### Variables

* [defaultLogger](_logging_.md#const-defaultlogger)

### Functions

* [getLogger](_logging_.md#getlogger)

## Type aliases

###  Logger

Ƭ **Logger**: *WinstonLogger*

*Defined in [lib/logging.ts:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.ts#L4)*

## Variables

### `Const` defaultLogger

• **defaultLogger**: *Logger‹›* = getLogger({ loglevel: 'info' })

*Defined in [lib/logging.ts:56](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.ts#L56)*

## Functions

###  getLogger

▸ **getLogger**(`options`: object): *Logger‹›*

*Defined in [lib/logging.ts:39](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.ts#L39)*

**Parameters:**

▪`Default value`  **options**: *object*= { loglevel: 'info' }

Name | Type | Default |
------ | ------ | ------ |
`loglevel` | string | "info" |

**Returns:** *Logger‹›*

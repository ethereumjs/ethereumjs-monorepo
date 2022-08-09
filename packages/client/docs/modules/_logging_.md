[ethereumjs-client](../README.md) › ["logging"](_logging_.md)

# Module: "logging"

## Index

### Type aliases

- [Logger](_logging_.md#logger)

### Variables

- [defaultLogger](_logging_.md#const-defaultlogger)

### Functions

- [getLogger](_logging_.md#getlogger)

## Type aliases

### Logger

Ƭ **Logger**: _WinstonLogger_

_Defined in [lib/logging.ts:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.ts#L4)_

## Variables

### `Const` defaultLogger

• **defaultLogger**: _Logger‹›_ = getLogger({ loglevel: 'info' })

_Defined in [lib/logging.ts:56](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.ts#L56)_

## Functions

### getLogger

▸ **getLogger**(`options`: object): _Logger‹›_

_Defined in [lib/logging.ts:39](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/logging.ts#L39)_

**Parameters:**

▪`Default value` **options**: _object_= { loglevel: 'info' }

| Name       | Type   | Default |
| ---------- | ------ | ------- |
| `loglevel` | string | "info"  |

**Returns:** _Logger‹›_

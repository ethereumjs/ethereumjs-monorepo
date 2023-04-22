[@ethereumjs/util](../README.md) / Lock

# Class: Lock

## Table of contents

### Constructors

- [constructor](Lock.md#constructor)

### Methods

- [acquire](Lock.md#acquire)
- [release](Lock.md#release)

## Constructors

### constructor

• **new Lock**()

## Methods

### acquire

▸ **acquire**(): `Promise`<`boolean`\>

Returns a promise used to wait for a permit to become available. This method should be awaited on.

#### Returns

`Promise`<`boolean`\>

A promise that gets resolved when execution is allowed to proceed.

#### Defined in

[packages/util/src/lock.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/lock.ts#L10)

___

### release

▸ **release**(): `void`

Increases the number of permits by one. If there are other functions waiting, one of them will
continue to execute in a future iteration of the event loop.

#### Returns

`void`

#### Defined in

[packages/util/src/lock.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/lock.ts#L25)

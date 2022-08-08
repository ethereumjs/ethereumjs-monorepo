[@ethereumjs/trie](../README.md) / TrieReadStream

# Class: TrieReadStream

## Hierarchy

- `Readable`

  ↳ **`TrieReadStream`**

## Table of contents

### Constructors

- [constructor](TrieReadStream.md#constructor)

### Properties

- [\_readableState](TrieReadStream.md#_readablestate)
- [destroyed](TrieReadStream.md#destroyed)
- [readable](TrieReadStream.md#readable)
- [readableAborted](TrieReadStream.md#readableaborted)
- [readableDidRead](TrieReadStream.md#readabledidread)
- [readableEncoding](TrieReadStream.md#readableencoding)
- [readableEnded](TrieReadStream.md#readableended)
- [readableFlowing](TrieReadStream.md#readableflowing)
- [readableHighWaterMark](TrieReadStream.md#readablehighwatermark)
- [readableLength](TrieReadStream.md#readablelength)
- [readableObjectMode](TrieReadStream.md#readableobjectmode)

### Methods

- [[asyncIterator]](TrieReadStream.md#[asynciterator])
- [\_destroy](TrieReadStream.md#_destroy)
- [\_read](TrieReadStream.md#_read)
- [\_undestroy](TrieReadStream.md#_undestroy)
- [addListener](TrieReadStream.md#addlistener)
- [destroy](TrieReadStream.md#destroy)
- [emit](TrieReadStream.md#emit)
- [eventNames](TrieReadStream.md#eventnames)
- [getMaxListeners](TrieReadStream.md#getmaxlisteners)
- [isPaused](TrieReadStream.md#ispaused)
- [listenerCount](TrieReadStream.md#listenercount)
- [listeners](TrieReadStream.md#listeners)
- [off](TrieReadStream.md#off)
- [on](TrieReadStream.md#on)
- [once](TrieReadStream.md#once)
- [pause](TrieReadStream.md#pause)
- [pipe](TrieReadStream.md#pipe)
- [prependListener](TrieReadStream.md#prependlistener)
- [prependOnceListener](TrieReadStream.md#prependoncelistener)
- [push](TrieReadStream.md#push)
- [rawListeners](TrieReadStream.md#rawlisteners)
- [read](TrieReadStream.md#read)
- [removeAllListeners](TrieReadStream.md#removealllisteners)
- [removeListener](TrieReadStream.md#removelistener)
- [resume](TrieReadStream.md#resume)
- [setEncoding](TrieReadStream.md#setencoding)
- [setMaxListeners](TrieReadStream.md#setmaxlisteners)
- [unpipe](TrieReadStream.md#unpipe)
- [unshift](TrieReadStream.md#unshift)
- [wrap](TrieReadStream.md#wrap)

## Constructors

### constructor

• **new TrieReadStream**(`trie`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [`Trie`](Trie.md) |

#### Overrides

Readable.constructor

#### Defined in

[packages/trie/src/util/readStream.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/readStream.ts#L10)

## Properties

### \_readableState

• **\_readableState**: `ReadableState`

#### Inherited from

Readable.\_readableState

#### Defined in

node_modules/@types/readable-stream/index.d.ts:144

___

### destroyed

• **destroyed**: `boolean`

#### Inherited from

Readable.destroyed

#### Defined in

node_modules/@types/readable-stream/index.d.ts:145

___

### readable

• **readable**: `boolean`

#### Inherited from

Readable.readable

#### Defined in

node_modules/@types/readable-stream/index.d.ts:55

___

### readableAborted

• `Readonly` **readableAborted**: `never`

#### Inherited from

Readable.readableAborted

#### Defined in

node_modules/@types/readable-stream/index.d.ts:290

___

### readableDidRead

• `Readonly` **readableDidRead**: `never`

#### Inherited from

Readable.readableDidRead

#### Defined in

node_modules/@types/readable-stream/index.d.ts:291

___

### readableEncoding

• `Readonly` **readableEncoding**: `never`

#### Inherited from

Readable.readableEncoding

#### Defined in

node_modules/@types/readable-stream/index.d.ts:292

___

### readableEnded

• `Readonly` **readableEnded**: `never`

#### Inherited from

Readable.readableEnded

#### Defined in

node_modules/@types/readable-stream/index.d.ts:293

___

### readableFlowing

• `Readonly` **readableFlowing**: ``null`` \| `boolean`

#### Inherited from

Readable.readableFlowing

#### Defined in

node_modules/@types/readable-stream/index.d.ts:56

___

### readableHighWaterMark

• `Readonly` **readableHighWaterMark**: `number`

#### Inherited from

Readable.readableHighWaterMark

#### Defined in

node_modules/@types/readable-stream/index.d.ts:57

___

### readableLength

• `Readonly` **readableLength**: `number`

#### Inherited from

Readable.readableLength

#### Defined in

node_modules/@types/readable-stream/index.d.ts:58

___

### readableObjectMode

• `Readonly` **readableObjectMode**: `never`

#### Inherited from

Readable.readableObjectMode

#### Defined in

node_modules/@types/readable-stream/index.d.ts:294

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): `AsyncIterableIterator`<`any`\>

#### Returns

`AsyncIterableIterator`<`any`\>

#### Inherited from

Readable.\_\_@asyncIterator@21364

#### Defined in

node_modules/@types/readable-stream/index.d.ts:141

___

### \_destroy

▸ **_destroy**(`error`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | ``null`` \| `Error` |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

#### Inherited from

Readable.\_destroy

#### Defined in

node_modules/@types/readable-stream/index.d.ts:69

___

### \_read

▸ **_read**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

Readable.\_read

#### Defined in

[packages/trie/src/util/readStream.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/readStream.ts#L17)

___

### \_undestroy

▸ **_undestroy**(): `void`

#### Returns

`void`

#### Inherited from

Readable.\_undestroy

#### Defined in

node_modules/@types/readable-stream/index.d.ts:149

___

### addListener

▸ **addListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

Event emitter
The defined events on documents including:
1. close
2. data
3. end
4. readable
5. error

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.addListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:81

▸ **addListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.addListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:82

▸ **addListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.addListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:83

▸ **addListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.addListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:84

▸ **addListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.addListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:85

▸ **addListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.addListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:86

___

### destroy

▸ **destroy**(`error?`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `error?` | `Error` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.destroy

#### Defined in

node_modules/@types/readable-stream/index.d.ts:70

___

### emit

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |

#### Returns

`boolean`

#### Inherited from

Readable.emit

#### Defined in

node_modules/@types/readable-stream/index.d.ts:88

▸ **emit**(`event`, `chunk`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `chunk` | `any` |

#### Returns

`boolean`

#### Inherited from

Readable.emit

#### Defined in

node_modules/@types/readable-stream/index.d.ts:89

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |

#### Returns

`boolean`

#### Inherited from

Readable.emit

#### Defined in

node_modules/@types/readable-stream/index.d.ts:90

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |

#### Returns

`boolean`

#### Inherited from

Readable.emit

#### Defined in

node_modules/@types/readable-stream/index.d.ts:91

▸ **emit**(`event`, `err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `err` | `Error` |

#### Returns

`boolean`

#### Inherited from

Readable.emit

#### Defined in

node_modules/@types/readable-stream/index.d.ts:92

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

Readable.emit

#### Defined in

node_modules/@types/readable-stream/index.d.ts:93

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

Readable.eventNames

#### Defined in

node_modules/@types/readable-stream/index.d.ts:139

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

Readable.getMaxListeners

#### Defined in

node_modules/@types/readable-stream/index.d.ts:133

___

### isPaused

▸ **isPaused**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Readable.isPaused

#### Defined in

node_modules/@types/readable-stream/index.d.ts:64

___

### listenerCount

▸ **listenerCount**(`eventName`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

Readable.listenerCount

#### Defined in

node_modules/@types/readable-stream/index.d.ts:138

___

### listeners

▸ **listeners**(`eventName`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

Readable.listeners

#### Defined in

node_modules/@types/readable-stream/index.d.ts:135

___

### off

▸ **off**(`eventName`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.off

#### Defined in

node_modules/@types/readable-stream/index.d.ts:131

___

### on

▸ **on**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.on

#### Defined in

node_modules/@types/readable-stream/index.d.ts:95

▸ **on**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.on

#### Defined in

node_modules/@types/readable-stream/index.d.ts:96

▸ **on**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.on

#### Defined in

node_modules/@types/readable-stream/index.d.ts:97

▸ **on**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.on

#### Defined in

node_modules/@types/readable-stream/index.d.ts:98

▸ **on**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.on

#### Defined in

node_modules/@types/readable-stream/index.d.ts:99

▸ **on**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.on

#### Defined in

node_modules/@types/readable-stream/index.d.ts:100

___

### once

▸ **once**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.once

#### Defined in

node_modules/@types/readable-stream/index.d.ts:102

▸ **once**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.once

#### Defined in

node_modules/@types/readable-stream/index.d.ts:103

▸ **once**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.once

#### Defined in

node_modules/@types/readable-stream/index.d.ts:104

▸ **once**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.once

#### Defined in

node_modules/@types/readable-stream/index.d.ts:105

▸ **once**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.once

#### Defined in

node_modules/@types/readable-stream/index.d.ts:106

▸ **once**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.once

#### Defined in

node_modules/@types/readable-stream/index.d.ts:107

___

### pause

▸ **pause**(): [`TrieReadStream`](TrieReadStream.md)

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.pause

#### Defined in

node_modules/@types/readable-stream/index.d.ts:62

___

### pipe

▸ **pipe**<`T`\>(`destination`, `options?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `_IWritable`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | `T` |
| `options?` | `Object` |
| `options.end?` | `boolean` |

#### Returns

`T`

#### Inherited from

Readable.pipe

#### Defined in

node_modules/@types/readable-stream/index.d.ts:297

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:109

▸ **prependListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:110

▸ **prependListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:111

▸ **prependListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:112

▸ **prependListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:113

▸ **prependListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:114

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependOnceListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:116

▸ **prependOnceListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependOnceListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:117

▸ **prependOnceListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependOnceListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:118

▸ **prependOnceListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependOnceListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:119

▸ **prependOnceListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependOnceListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:120

▸ **prependOnceListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.prependOnceListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:121

___

### push

▸ **push**(`chunk`, `encoding?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `any` |
| `encoding?` | `string` |

#### Returns

`boolean`

#### Inherited from

Readable.push

#### Defined in

node_modules/@types/readable-stream/index.d.ts:68

___

### rawListeners

▸ **rawListeners**(`eventName`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

Readable.rawListeners

#### Defined in

node_modules/@types/readable-stream/index.d.ts:137

___

### read

▸ **read**(`size?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size?` | `number` |

#### Returns

`any`

#### Inherited from

Readable.read

#### Defined in

node_modules/@types/readable-stream/index.d.ts:60

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.removeAllListeners

#### Defined in

node_modules/@types/readable-stream/index.d.ts:130

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.removeListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:123

▸ **removeListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.removeListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:124

▸ **removeListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.removeListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:125

▸ **removeListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.removeListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:126

▸ **removeListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.removeListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:127

▸ **removeListener**(`event`, `listener`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.removeListener

#### Defined in

node_modules/@types/readable-stream/index.d.ts:128

___

### resume

▸ **resume**(): [`TrieReadStream`](TrieReadStream.md)

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.resume

#### Defined in

node_modules/@types/readable-stream/index.d.ts:63

___

### setEncoding

▸ **setEncoding**(`encoding`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoding` | `string` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.setEncoding

#### Defined in

node_modules/@types/readable-stream/index.d.ts:61

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.setMaxListeners

#### Defined in

node_modules/@types/readable-stream/index.d.ts:132

___

### unpipe

▸ **unpipe**(`destination?`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination?` | `Writable` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.unpipe

#### Defined in

node_modules/@types/readable-stream/index.d.ts:65

___

### unshift

▸ **unshift**(`chunk`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `any` |

#### Returns

`void`

#### Inherited from

Readable.unshift

#### Defined in

node_modules/@types/readable-stream/index.d.ts:66

___

### wrap

▸ **wrap**(`oldStream`): [`TrieReadStream`](TrieReadStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `oldStream` | `Readable` |

#### Returns

[`TrieReadStream`](TrieReadStream.md)

#### Inherited from

Readable.wrap

#### Defined in

node_modules/@types/readable-stream/index.d.ts:67

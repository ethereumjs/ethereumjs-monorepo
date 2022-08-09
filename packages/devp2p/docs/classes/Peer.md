[@ethereumjs/devp2p](../README.md) / Peer

# Class: Peer

## Hierarchy

- `EventEmitter`

  ↳ **`Peer`**

## Table of contents

### Constructors

- [constructor](Peer.md#constructor)

### Properties

- [\_EIP8](Peer.md#_eip8)
- [\_capabilities](Peer.md#_capabilities)
- [\_clientId](Peer.md#_clientid)
- [\_closed](Peer.md#_closed)
- [\_common](Peer.md#_common)
- [\_connected](Peer.md#_connected)
- [\_disconnectReason](Peer.md#_disconnectreason)
- [\_disconnectWe](Peer.md#_disconnectwe)
- [\_eciesSession](Peer.md#_eciessession)
- [\_hello](Peer.md#_hello)
- [\_id](Peer.md#_id)
- [\_logger](Peer.md#_logger)
- [\_nextPacketSize](Peer.md#_nextpacketsize)
- [\_pingIntervalId](Peer.md#_pingintervalid)
- [\_pingTimeout](Peer.md#_pingtimeout)
- [\_pingTimeoutId](Peer.md#_pingtimeoutid)
- [\_port](Peer.md#_port)
- [\_protocols](Peer.md#_protocols)
- [\_remoteClientIdFilter](Peer.md#_remoteclientidfilter)
- [\_remoteId](Peer.md#_remoteid)
- [\_socket](Peer.md#_socket)
- [\_socketData](Peer.md#_socketdata)
- [\_state](Peer.md#_state)
- [\_weHello](Peer.md#_wehello)
- [captureRejectionSymbol](Peer.md#capturerejectionsymbol)
- [captureRejections](Peer.md#capturerejections)
- [defaultMaxListeners](Peer.md#defaultmaxlisteners)
- [errorMonitor](Peer.md#errormonitor)

### Methods

- [\_addFirstPeerDebugger](Peer.md#_addfirstpeerdebugger)
- [\_getProtocol](Peer.md#_getprotocol)
- [\_handleAck](Peer.md#_handleack)
- [\_handleAuth](Peer.md#_handleauth)
- [\_handleBody](Peer.md#_handlebody)
- [\_handleDisconnect](Peer.md#_handledisconnect)
- [\_handleHeader](Peer.md#_handleheader)
- [\_handleHello](Peer.md#_handlehello)
- [\_handleMessage](Peer.md#_handlemessage)
- [\_handlePing](Peer.md#_handleping)
- [\_handlePong](Peer.md#_handlepong)
- [\_onSocketClose](Peer.md#_onsocketclose)
- [\_onSocketData](Peer.md#_onsocketdata)
- [\_sendAck](Peer.md#_sendack)
- [\_sendAuth](Peer.md#_sendauth)
- [\_sendDisconnect](Peer.md#_senddisconnect)
- [\_sendHello](Peer.md#_sendhello)
- [\_sendMessage](Peer.md#_sendmessage)
- [\_sendPing](Peer.md#_sendping)
- [\_sendPong](Peer.md#_sendpong)
- [addListener](Peer.md#addlistener)
- [disconnect](Peer.md#disconnect)
- [emit](Peer.md#emit)
- [eventNames](Peer.md#eventnames)
- [getDisconnectPrefix](Peer.md#getdisconnectprefix)
- [getHelloMessage](Peer.md#gethellomessage)
- [getId](Peer.md#getid)
- [getMaxListeners](Peer.md#getmaxlisteners)
- [getMsgPrefix](Peer.md#getmsgprefix)
- [getProtocols](Peer.md#getprotocols)
- [listenerCount](Peer.md#listenercount)
- [listeners](Peer.md#listeners)
- [off](Peer.md#off)
- [on](Peer.md#on)
- [once](Peer.md#once)
- [prependListener](Peer.md#prependlistener)
- [prependOnceListener](Peer.md#prependoncelistener)
- [rawListeners](Peer.md#rawlisteners)
- [removeAllListeners](Peer.md#removealllisteners)
- [removeListener](Peer.md#removelistener)
- [setMaxListeners](Peer.md#setmaxlisteners)
- [getEventListeners](Peer.md#geteventlisteners)
- [listenerCount](Peer.md#listenercount-1)
- [on](Peer.md#on-1)
- [once](Peer.md#once-1)

## Constructors

### constructor

• **new Peer**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L111)

## Properties

### \_EIP8

• **\_EIP8**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L88)

___

### \_capabilities

• `Optional` **\_capabilities**: [`Capabilities`](../interfaces/Capabilities.md)[]

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L82)

___

### \_clientId

• **\_clientId**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L81)

___

### \_closed

• **\_closed**: `boolean`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L98)

___

### \_common

• **\_common**: `Common`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L83)

___

### \_connected

• **\_connected**: `boolean`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L99)

___

### \_disconnectReason

• `Optional` **\_disconnectReason**: [`DISCONNECT_REASONS`](../enums/DISCONNECT_REASONS.md)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L100)

___

### \_disconnectWe

• **\_disconnectWe**: `any`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L101)

___

### \_eciesSession

• **\_eciesSession**: [`ECIES`](ECIES.md)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L89)

___

### \_hello

• **\_hello**: ``null`` \| [`Hello`](../interfaces/Hello.md)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L92)

___

### \_id

• **\_id**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L85)

___

### \_logger

• **\_logger**: `Debugger`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L103)

___

### \_nextPacketSize

• **\_nextPacketSize**: `number`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L93)

___

### \_pingIntervalId

• **\_pingIntervalId**: ``null`` \| `Timeout`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L96)

___

### \_pingTimeout

• **\_pingTimeout**: `number`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L102)

___

### \_pingTimeoutId

• **\_pingTimeoutId**: ``null`` \| `Timeout`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L97)

___

### \_port

• **\_port**: `number`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L84)

___

### \_protocols

• **\_protocols**: [`ProtocolDescriptor`](../interfaces/ProtocolDescriptor.md)[]

Subprotocols (e.g. `ETH`) derived from the exchange on
capabilities

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L109)

___

### \_remoteClientIdFilter

• **\_remoteClientIdFilter**: `any`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L86)

___

### \_remoteId

• **\_remoteId**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L87)

___

### \_socket

• **\_socket**: `Socket`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L94)

___

### \_socketData

• **\_socketData**: `BufferList`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L95)

___

### \_state

• **\_state**: `string`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L90)

___

### \_weHello

• **\_weHello**: ``null`` \| [`HelloMsg`](../README.md#hellomsg)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L91)

___

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](DPT.md#capturerejectionsymbol)

#### Inherited from

EventEmitter.captureRejectionSymbol

#### Defined in

node_modules/@types/node/events.d.ts:273

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

EventEmitter.captureRejections

#### Defined in

node_modules/@types/node/events.d.ts:278

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:279

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](DPT.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Inherited from

EventEmitter.errorMonitor

#### Defined in

node_modules/@types/node/events.d.ts:272

## Methods

### \_addFirstPeerDebugger

▸ **_addFirstPeerDebugger**(): `void`

Called once from the subprotocol (e.g. `ETH`) on the peer
where a first successful `STATUS` msg exchange could be achieved.

Can be used together with the `devp2p:FIRST_PEER` debugger.

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:700](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L700)

___

### \_getProtocol

▸ **_getProtocol**(`code`): `undefined` \| [`ProtocolDescriptor`](../interfaces/ProtocolDescriptor.md)

Returns either a protocol object with a `protocol` parameter
reference to this Peer instance or to a subprotocol instance (e.g. `ETH`)
(depending on the `code` provided)

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |

#### Returns

`undefined` \| [`ProtocolDescriptor`](../interfaces/ProtocolDescriptor.md)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:662](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L662)

___

### \_handleAck

▸ **_handleAck**(): `void`

ACK message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L344)

___

### \_handleAuth

▸ **_handleAuth**(): `void`

AUTH message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:321](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L321)

___

### \_handleBody

▸ **_handleBody**(): `void`

Handle message body

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:523](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L523)

___

### \_handleDisconnect

▸ **_handleDisconnect**(`payload`): `void`

DISCONNECT message received

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `any` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:452](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L452)

___

### \_handleHeader

▸ **_handleHeader**(): `void`

Handle message header

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:504](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L504)

___

### \_handleHello

▸ **_handleHello**(`payload`): `void`

HELLO message received

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `any` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:373](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L373)

___

### \_handleMessage

▸ **_handleMessage**(`code`, `msg`): `void`

Message handling, called from a SubProtocol context

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`PREFIXES`](../enums/PREFIXES.md) |
| `msg` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:484](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L484)

___

### \_handlePing

▸ **_handlePing**(): `void`

PING message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:468](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L468)

___

### \_handlePong

▸ **_handlePong**(): `void`

PONG message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:475](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L475)

___

### \_onSocketClose

▸ **_onSocketClose**(): `void`

React to socket being closed

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:649](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L649)

___

### \_onSocketData

▸ **_onSocketData**(`data`): `void`

Process socket data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:619](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L619)

___

### \_sendAck

▸ **_sendAck**(): `void`

Send ACK message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L182)

___

### \_sendAuth

▸ **_sendAuth**(): `void`

Send AUTH message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L161)

___

### \_sendDisconnect

▸ **_sendDisconnect**(`reason`): `void`

Send DISCONNECT message

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason` | [`DISCONNECT_REASONS`](../enums/DISCONNECT_REASONS.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L264)

___

### \_sendHello

▸ **_sendHello**(): `void`

Send HELLO message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L227)

___

### \_sendMessage

▸ **_sendMessage**(`code`, `data`): `undefined` \| `boolean`

Create message HEADER and BODY and send to socket
Also called from SubProtocol context

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `data` | `Buffer` |

#### Returns

`undefined` \| `boolean`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L207)

___

### \_sendPing

▸ **_sendPing**(): `void`

Send PING message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L280)

___

### \_sendPong

▸ **_sendPong**(): `void`

Send PONG message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L303)

___

### addListener

▸ **addListener**(`eventName`, `listener`): [`Peer`](Peer.md)

Alias for `emitter.on(eventName, listener)`.

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Peer`](Peer.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/events.d.ts:299

___

### disconnect

▸ **disconnect**(`reason?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `reason` | [`DISCONNECT_REASONS`](../enums/DISCONNECT_REASONS.md) | `DISCONNECT_REASONS.DISCONNECT_REQUESTED` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:690](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L690)

___

### emit

▸ **emit**(`eventName`, ...`args`): `boolean`

Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/events.d.ts:555

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
const EventEmitter = require('events');
const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

**`Since`**

v6.0.0

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/events.d.ts:614

___

### getDisconnectPrefix

▸ **getDisconnectPrefix**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`DISCONNECT_REASONS`](../enums/DISCONNECT_REASONS.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:686](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L686)

___

### getHelloMessage

▸ **getHelloMessage**(): ``null`` \| [`Hello`](../interfaces/Hello.md)

#### Returns

``null`` \| [`Hello`](../interfaces/Hello.md)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:674](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L674)

___

### getId

▸ **getId**(): ``null`` \| `Buffer`

#### Returns

``null`` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:669](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L669)

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](Peer.md#defaultmaxlisteners).

**`Since`**

v1.0.0

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:471

___

### getMsgPrefix

▸ **getMsgPrefix**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`PREFIXES`](../enums/PREFIXES.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:682](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L682)

___

### getProtocols

▸ **getProtocols**<`T`\>(): `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ETH`](ETH-1.md) \| [`LES`](LES-1.md) |

#### Returns

`T`[]

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:678](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L678)

___

### listenerCount

▸ **listenerCount**(`eventName`): `number`

Returns the number of listeners listening to the event named `eventName`.

**`Since`**

v3.2.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:561

___

### listeners

▸ **listeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/events.d.ts:484

___

### off

▸ **off**(`eventName`, `listener`): [`Peer`](Peer.md)

Alias for `emitter.removeListener()`.

**`Since`**

v10.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Peer`](Peer.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:444

___

### on

▸ **on**(`eventName`, `listener`): [`Peer`](Peer.md)

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

**`Since`**

v0.1.101

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Peer`](Peer.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:330

___

### once

▸ **once**(`eventName`, `listener`): [`Peer`](Peer.md)

Adds a **one-time**`listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

**`Since`**

v0.3.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Peer`](Peer.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:359

___

### prependListener

▸ **prependListener**(`eventName`, `listener`): [`Peer`](Peer.md)

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Peer`](Peer.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:579

___

### prependOnceListener

▸ **prependOnceListener**(`eventName`, `listener`): [`Peer`](Peer.md)

Adds a **one-time**`listener` function for the event named `eventName` to the_beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Peer`](Peer.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/events.d.ts:595

___

### rawListeners

▸ **rawListeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

**`Since`**

v9.4.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/events.d.ts:514

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`Peer`](Peer.md)

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`Peer`](Peer.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:455

___

### removeListener

▸ **removeListener**(`eventName`, `listener`): [`Peer`](Peer.md)

Removes the specified `listener` from the listener array for the event named`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any`removeListener()` or `removeAllListeners()` calls _after_ emitting and_before_ the last listener finishes execution will
not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`listener is removed:

```js
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Peer`](Peer.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:439

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`Peer`](Peer.md)

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v0.3.5

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`Peer`](Peer.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:465

___

### getEventListeners

▸ `Static` **getEventListeners**(`emitter`, `name`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```js
const { getEventListeners, EventEmitter } = require('events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  getEventListeners(ee, 'foo'); // [listener]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  getEventListeners(et, 'foo'); // [listener]
}
```

**`Since`**

v15.2.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` \| `DOMEventTarget` |
| `name` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.getEventListeners

#### Defined in

node_modules/@types/node/events.d.ts:262

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `eventName`): `number`

A class method that returns the number of listeners for the given `eventName`registered on the given `emitter`.

```js
const { EventEmitter, listenerCount } = require('events');
const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

**`Since`**

v0.9.12

**`Deprecated`**

Since v3.2.0 - Use `listenerCount` instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | `EventEmitter` | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:234

___

### on

▸ `Static` **on**(`emitter`, `eventName`, `options?`): `AsyncIterableIterator`<`any`\>

```js
const { on, EventEmitter } = require('events');

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
const { on, EventEmitter } = require('events');
const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

**`Since`**

v13.6.0, v12.16.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | `EventEmitter` | - |
| `eventName` | `string` | The name of the event being listened for |
| `options?` | `StaticEventEmitterOptions` | - |

#### Returns

`AsyncIterableIterator`<`any`\>

that iterates `eventName` events emitted by the `emitter`

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:217

___

### once

▸ `Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
const { once, EventEmitter } = require('events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.log('error happened', err);
  }
}

run();
```

The special handling of the `'error'` event is only used when `events.once()`is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
const { EventEmitter, once } = require('events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.log('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
const { EventEmitter, once } = require('events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

**`Since`**

v11.13.0, v10.16.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `eventName` | `string` \| `symbol` |
| `options?` | `StaticEventEmitterOptions` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:157

▸ `Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `eventName` | `string` |
| `options?` | `StaticEventEmitterOptions` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:158

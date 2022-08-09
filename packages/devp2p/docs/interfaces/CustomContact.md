[@ethereumjs/devp2p](../README.md) / CustomContact

# Interface: CustomContact

## Hierarchy

- [`PeerInfo`](PeerInfo.md)

  ↳ **`CustomContact`**

## Table of contents

### Properties

- [address](CustomContact.md#address)
- [id](CustomContact.md#id)
- [tcpPort](CustomContact.md#tcpport)
- [udpPort](CustomContact.md#udpport)
- [vectorClock](CustomContact.md#vectorclock)

## Properties

### address

• `Optional` **address**: `string`

#### Inherited from

[PeerInfo](PeerInfo.md).[address](PeerInfo.md#address)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L17)

___

### id

• **id**: `Uint8Array` \| `Buffer`

#### Overrides

[PeerInfo](PeerInfo.md).[id](PeerInfo.md#id)

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L10)

___

### tcpPort

• `Optional` **tcpPort**: ``null`` \| `number`

#### Inherited from

[PeerInfo](PeerInfo.md).[tcpPort](PeerInfo.md#tcpport)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L19)

___

### udpPort

• `Optional` **udpPort**: ``null`` \| `number`

#### Inherited from

[PeerInfo](PeerInfo.md).[udpPort](PeerInfo.md#udpport)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L18)

___

### vectorClock

• **vectorClock**: `number`

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L11)

[@ethereumjs/devp2p](../README.md) / CustomContact

# Interface: CustomContact

## Hierarchy

* [*PeerInfo*](peerinfo.md)

  ↳ **CustomContact**

## Table of contents

### Properties

- [address](customcontact.md#address)
- [id](customcontact.md#id)
- [tcpPort](customcontact.md#tcpport)
- [udpPort](customcontact.md#udpport)
- [vectorClock](customcontact.md#vectorclock)

## Properties

### address

• `Optional` **address**: *string*

Inherited from: [PeerInfo](peerinfo.md).[address](peerinfo.md#address)

Defined in: [dpt/dpt.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L16)

___

### id

• **id**: *Buffer* \| *Uint8Array*

Overrides: [PeerInfo](peerinfo.md).[id](peerinfo.md#id)

Defined in: [dpt/kbucket.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L9)

___

### tcpPort

• `Optional` **tcpPort**: *null* \| *number*

Inherited from: [PeerInfo](peerinfo.md).[tcpPort](peerinfo.md#tcpport)

Defined in: [dpt/dpt.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L18)

___

### udpPort

• `Optional` **udpPort**: *null* \| *number*

Inherited from: [PeerInfo](peerinfo.md).[udpPort](peerinfo.md#udpport)

Defined in: [dpt/dpt.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L17)

___

### vectorClock

• **vectorClock**: *number*

Defined in: [dpt/kbucket.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L10)

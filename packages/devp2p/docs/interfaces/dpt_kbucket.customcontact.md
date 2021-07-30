[@ethereumjs/devp2p](../README.md) / [dpt/kbucket](../modules/dpt_kbucket.md) / CustomContact

# Interface: CustomContact

[dpt/kbucket](../modules/dpt_kbucket.md).CustomContact

## Hierarchy

- [PeerInfo](dpt_dpt.peerinfo.md)

  ↳ **CustomContact**

## Table of contents

### Properties

- [address](dpt_kbucket.customcontact.md#address)
- [id](dpt_kbucket.customcontact.md#id)
- [tcpPort](dpt_kbucket.customcontact.md#tcpport)
- [udpPort](dpt_kbucket.customcontact.md#udpport)
- [vectorClock](dpt_kbucket.customcontact.md#vectorclock)

## Properties

### address

• `Optional` **address**: `string`

#### Inherited from

[PeerInfo](dpt_dpt.peerinfo.md).[address](dpt_dpt.peerinfo.md#address)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L16)

___

### id

• **id**: `Buffer` \| `Uint8Array`

#### Overrides

[PeerInfo](dpt_dpt.peerinfo.md).[id](dpt_dpt.peerinfo.md#id)

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L9)

___

### tcpPort

• `Optional` **tcpPort**: ``null`` \| `number`

#### Inherited from

[PeerInfo](dpt_dpt.peerinfo.md).[tcpPort](dpt_dpt.peerinfo.md#tcpport)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L18)

___

### udpPort

• `Optional` **udpPort**: ``null`` \| `number`

#### Inherited from

[PeerInfo](dpt_dpt.peerinfo.md).[udpPort](dpt_dpt.peerinfo.md#udpport)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L17)

___

### vectorClock

• **vectorClock**: `number`

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L10)

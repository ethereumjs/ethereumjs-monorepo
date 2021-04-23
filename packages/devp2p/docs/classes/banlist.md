[@ethereumjs/devp2p](../README.md) / BanList

# Class: BanList

## Table of contents

### Constructors

- [constructor](banlist.md#constructor)

### Methods

- [add](banlist.md#add)
- [has](banlist.md#has)

## Constructors

### constructor

\+ **new BanList**(): [*BanList*](banlist.md)

**Returns:** [*BanList*](banlist.md)

Defined in: [dpt/ban-list.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L11)

## Methods

### add

▸ **add**(`obj`: *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md), `maxAge?`: *number*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md) |
`maxAge?` | *number* |

**Returns:** *void*

Defined in: [dpt/ban-list.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L16)

___

### has

▸ **has**(`obj`: *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md)): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *boolean*

Defined in: [dpt/ban-list.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L23)

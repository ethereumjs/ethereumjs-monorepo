**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / "dpt/index"

# Module: "dpt/index"

## Index

### Classes

* [BanList](../classes/_dpt_index_.banlist.md)
* [DPT](../classes/_dpt_index_.dpt.md)
* [KBucket](../classes/_dpt_index_.kbucket.md)
* [Server](../classes/_dpt_index_.server.md)

### Interfaces

* [DptServerOptions](../interfaces/_dpt_index_.dptserveroptions.md)
* [KObj](../interfaces/_dpt_index_.kobj.md)
* [PeerInfo](../interfaces/_dpt_index_.peerinfo.md)

### Functions

* [decode](_dpt_index_.md#decode)
* [encode](_dpt_index_.md#encode)

## Functions

### decode

▸ **decode**(`buffer`: Buffer): object

*Defined in [src/dpt/message.ts:188](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/message.ts#L188)*

#### Parameters:

Name | Type |
------ | ------ |
`buffer` | Buffer |

**Returns:** object

Name | Type |
------ | ------ |
`data` | any |
`publicKey` | Buffer |
`typename` | string \| number |

___

### encode

▸ **encode**\<T>(`typename`: string, `data`: T, `privateKey`: Buffer): Buffer

*Defined in [src/dpt/message.ts:175](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/message.ts#L175)*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`typename` | string |
`data` | T |
`privateKey` | Buffer |

**Returns:** Buffer

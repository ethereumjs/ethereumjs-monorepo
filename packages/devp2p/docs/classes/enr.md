[@ethereumjs/devp2p](../README.md) / ENR

# Class: ENR

## Table of contents

### Constructors

- [constructor](enr.md#constructor)

### Properties

- [BRANCH\_PREFIX](enr.md#branch_prefix)
- [RECORD\_PREFIX](enr.md#record_prefix)
- [ROOT\_PREFIX](enr.md#root_prefix)
- [TREE\_PREFIX](enr.md#tree_prefix)

### Methods

- [\_getIpProtocolConversionCodes](enr.md#_getipprotocolconversioncodes)
- [parseAndVerifyRecord](enr.md#parseandverifyrecord)
- [parseAndVerifyRoot](enr.md#parseandverifyroot)
- [parseBranch](enr.md#parsebranch)
- [parseTree](enr.md#parsetree)

## Constructors

### constructor

\+ **new ENR**(): [*ENR*](enr.md)

**Returns:** [*ENR*](enr.md)

## Properties

### BRANCH\_PREFIX

▪ `Static` `Readonly` **BRANCH\_PREFIX**: *enrtree-branch:*= 'enrtree-branch:'

Defined in: [dns/enr.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/enr.ts#L34)

___

### RECORD\_PREFIX

▪ `Static` `Readonly` **RECORD\_PREFIX**: *enr:*= 'enr:'

Defined in: [dns/enr.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/enr.ts#L32)

___

### ROOT\_PREFIX

▪ `Static` `Readonly` **ROOT\_PREFIX**: *enrtree-root:*= 'enrtree-root:'

Defined in: [dns/enr.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/enr.ts#L35)

___

### TREE\_PREFIX

▪ `Static` `Readonly` **TREE\_PREFIX**: *enrtree:*= 'enrtree:'

Defined in: [dns/enr.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/enr.ts#L33)

## Methods

### \_getIpProtocolConversionCodes

▸ `Static`**_getIpProtocolConversionCodes**(`protocolId`: *Buffer*): ProtocolCodes

Gets relevant multiaddr conversion codes for ipv4, ipv6 and tcp, udp formats

#### Parameters:

Name | Type |
:------ | :------ |
`protocolId` | *Buffer* |

**Returns:** ProtocolCodes

Defined in: [dns/enr.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/enr.ts#L176)

___

### parseAndVerifyRecord

▸ `Static`**parseAndVerifyRecord**(`enr`: *string*): [*PeerInfo*](../interfaces/peerinfo.md)

Converts an Ethereum Name Record (EIP-778) string into a PeerInfo object after validating
its signature component with the public key encoded in the record itself.

The record components are:
> signature: cryptographic signature of record contents
> seq: The sequence number, a 64-bit unsigned integer which increases whenever
       the record changes and is republished.
> A set of arbitrary key/value pairs

#### Parameters:

Name | Type |
:------ | :------ |
`enr` | *string* |

**Returns:** [*PeerInfo*](../interfaces/peerinfo.md)

Defined in: [dns/enr.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/enr.ts#L50)

___

### parseAndVerifyRoot

▸ `Static`**parseAndVerifyRoot**(`root`: *string*, `publicKey`: *string*): *string*

Extracts the branch subdomain referenced by a DNS tree root string after verifying
the root record signature with its base32 compressed public key. Geth's top level DNS
domains and their public key can be found in: go-ethereum/params/bootnodes

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`root` | *string* | (See EIP-1459 for encoding details)   |
`publicKey` | *string* | - |

**Returns:** *string*

subdomain subdomain to retrieve branch records from.

Defined in: [dns/enr.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/enr.ts#L92)

___

### parseBranch

▸ `Static`**parseBranch**(`branch`: *string*): *string*[]

Returns subdomains listed in an ENR branch entry. These in turn lead to
either further branch entries or ENR records.

#### Parameters:

Name | Type |
:------ | :------ |
`branch` | *string* |

**Returns:** *string*[]

Defined in: [dns/enr.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/enr.ts#L162)

___

### parseTree

▸ `Static`**parseTree**(`tree`: *string*): ENRTreeValues

Returns the public key and top level domain of an ENR tree entry.
The domain is the starting point for traversing a set of linked DNS TXT records
and the public key is used to verify the root entry record

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`tree` | *string* | (See EIP-1459 )   |

**Returns:** ENRTreeValues

Defined in: [dns/enr.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/enr.ts#L137)

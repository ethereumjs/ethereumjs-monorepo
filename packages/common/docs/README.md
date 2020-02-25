# ethereumjs-common

## Index

### Classes

- [Common](classes/common.md)

### Interfaces

- [BootstrapNode](interfaces/bootstrapnode.md)
- [Chain](interfaces/chain.md)
- [GenesisBlock](interfaces/genesisblock.md)
- [Hardfork](interfaces/hardfork.md)
- [chainsType](interfaces/chainstype.md)
- [genesisStatesType](interfaces/genesisstatestype.md)
- [hardforkOptions](interfaces/hardforkoptions.md)

### Functions

- [genesisStateById](#genesisstatebyid)
- [genesisStateByName](#genesisstatebyname)

### Object literals

- [genesisStates](#genesisstates)

---

## Functions

<a id="genesisstatebyid"></a>

### genesisStateById

▸ **genesisStateById**(id: _`number`_): `any`

_Defined in [genesisStates/index.ts:23](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L23)_

Returns the genesis state by network ID

**Parameters:**

| Name | Type     | Description                |
| ---- | -------- | -------------------------- |
| id   | `number` | ID of the network (e.g. 1) |

**Returns:** `any`
Dictionary with genesis accounts

---

<a id="genesisstatebyname"></a>

### genesisStateByName

▸ **genesisStateByName**(name: _`string`_): `any`

_Defined in [genesisStates/index.ts:32](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L32)_

Returns the genesis state by network name

**Parameters:**

| Name | Type     | Description                          |
| ---- | -------- | ------------------------------------ |
| name | `string` | Name of the network (e.g. 'mainnet') |

**Returns:** `any`
Dictionary with genesis accounts

---

## Object literals

<a id="genesisstates"></a>

### `<Const>` genesisStates

**genesisStates**: _`object`_

_Defined in [genesisStates/index.ts:3](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L3)_

<a id="genesisstates.goerli"></a>

#### goerli

**● goerli**: _`any`_ = require('./goerli.json')

_Defined in [genesisStates/index.ts:15](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L15)_

---

<a id="genesisstates.kovan"></a>

#### kovan

**● kovan**: _`any`_ = require('./kovan.json')

_Defined in [genesisStates/index.ts:14](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L14)_

---

<a id="genesisstates.mainnet"></a>

#### mainnet

**● mainnet**: _`any`_ = require('./mainnet.json')

_Defined in [genesisStates/index.ts:11](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L11)_

---

<a id="genesisstates.rinkeby"></a>

#### rinkeby

**● rinkeby**: _`any`_ = require('./rinkeby.json')

_Defined in [genesisStates/index.ts:13](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L13)_

---

<a id="genesisstates.ropsten"></a>

#### ropsten

**● ropsten**: _`any`_ = require('./ropsten.json')

_Defined in [genesisStates/index.ts:12](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L12)_

---

<a id="genesisstates.names"></a>

#### names

**names**: _`object`_

_Defined in [genesisStates/index.ts:4](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L4)_

<a id="genesisstates.names.1"></a>

#### 1

**● 1**: _`string`_ = "mainnet"

_Defined in [genesisStates/index.ts:5](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L5)_

---

<a id="genesisstates.names.3"></a>

#### 3

**● 3**: _`string`_ = "ropsten"

_Defined in [genesisStates/index.ts:6](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L6)_

---

<a id="genesisstates.names.4"></a>

#### 4

**● 4**: _`string`_ = "rinkeby"

_Defined in [genesisStates/index.ts:7](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L7)_

---

<a id="genesisstates.names.42"></a>

#### 42

**● 42**: _`string`_ = "kovan"

_Defined in [genesisStates/index.ts:8](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L8)_

---

<a id="genesisstates.names.6284"></a>

#### 6284

**● 6284**: _`string`_ = "goerli"

_Defined in [genesisStates/index.ts:9](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/genesisStates/index.ts#L9)_

---

---

---

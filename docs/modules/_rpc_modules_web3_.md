[ethereumjs-client](../README.md) › ["rpc/modules/web3"](_rpc_modules_web3_.md)

# Module: "rpc/modules/web3"

## Index

### Classes

* [Web3](../classes/_rpc_modules_web3_.web3.md)

### Variables

* [addHexPrefix](_rpc_modules_web3_.md#addhexprefix)
* [keccak](_rpc_modules_web3_.md#keccak)
* [middleware](_rpc_modules_web3_.md#middleware)
* [platform](_rpc_modules_web3_.md#platform)
* [toBuffer](_rpc_modules_web3_.md#tobuffer)
* [validators](_rpc_modules_web3_.md#validators)

## Variables

###  addHexPrefix

• **addHexPrefix**: *function*

*Defined in [lib/rpc/modules/web3.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.js#L4)*

#### Type declaration:

▸ (`str`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

___

###  keccak

• **keccak**: *function*

*Defined in [lib/rpc/modules/web3.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.js#L4)*

#### Type declaration:

▸ (`a`: Buffer, `bits?`: undefined | number): *Buffer*

**Parameters:**

Name | Type |
------ | ------ |
`a` | Buffer |
`bits?` | undefined &#124; number |

___

###  middleware

• **middleware**: *middleware*

*Defined in [lib/rpc/modules/web3.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.js#L3)*

___

###  platform

• **platform**: *platform*

*Defined in [lib/rpc/modules/web3.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.js#L5)*

___

###  toBuffer

• **toBuffer**: *function*

*Defined in [lib/rpc/modules/web3.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.js#L4)*

#### Type declaration:

▸ (`v`: any): *Buffer*

**Parameters:**

Name | Type |
------ | ------ |
`v` | any |

___

###  validators

• **validators**: *object*

*Defined in [lib/rpc/modules/web3.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.js#L3)*

#### Type declaration:

* **blockHash**(`params`: any[], `index`: number): *undefined | object*

* **bool**(`params`: any[], `index`: number): *undefined | object*

* **hex**(`params`: any[], `index`: number): *undefined | object*

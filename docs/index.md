# Transaction

[index.js:48-297](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L48-L297 "Source code on GitHub")

Creates a new transaction object.

**Parameters**

-   `data` **Buffer or Array or Object** a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple.Or lastly an Object containing the Properties of the transaction like in the Usage example.For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
    -   `data.chainId` **Number** EIP 155 chainId - mainnet: 1, ropsten: 3
    -   `data.gasLimit` **Buffer** transaction gas limit
    -   `data.gasPrice` **Buffer** transaction gas price
    -   `data.to` **Buffer** to the to address
    -   `data.nonce` **Buffer** nonce number
    -   `data.data` **Buffer** this will contain the data of the message or the init of a contract
    -   `data.v` **Buffer** EC signature parameter
    -   `data.r` **Buffer** EC signature parameter
    -   `data.s` **Buffer** EC recovery ID
    -   `data.value` **Buffer** the amount of ether sent

**Properties**

-   `raw` **Buffer** The raw rlp encoded transaction

**Examples**

```javascript
var rawTx = {
  nonce: '00',
  gasPrice: '09184e72a000',
  gasLimit: '2710',
  to: '0000000000000000000000000000000000000000',
  value: '00',
  data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
  v: '1c',
  r: '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
  s '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
};
var tx = new Transaction(rawTx);
```

## getBaseFee

[index.js:258-264](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L258-L264 "Source code on GitHub")

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

Returns **BN** 

## getChainId

[index.js:176-178](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L176-L178 "Source code on GitHub")

returns the public key of the sender

Returns **Buffer** 

## getDataFee

[index.js:245-252](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L245-L252 "Source code on GitHub")

The amount of gas paid for the data in this tx

Returns **BN** 

## getSenderAddress

[index.js:184-191](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L184-L191 "Source code on GitHub")

returns the sender's address

Returns **Buffer** 

## getSenderPublicKey

[index.js:197-202](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L197-L202 "Source code on GitHub")

returns the public key of the sender

Returns **Buffer** 

## getUpfrontCost

[index.js:270-274](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L270-L274 "Source code on GitHub")

the up front amount that an account must have for this transaction to be valid

Returns **BN** 

## hash

[index.js:144-170](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L144-L170 "Source code on GitHub")

Computes a sha3-256 hash of the serialized tx

**Parameters**

-   `includeSignature` **[Boolean]** whether or not to inculde the signature (optional, default `true`)

Returns **Buffer** 

## sign

[index.js:232-239](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L232-L239 "Source code on GitHub")

sign a transaction with a given a private key

**Parameters**

-   `privateKey` **Buffer** 

## toCreationAddress

[index.js:135-137](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L135-L137 "Source code on GitHub")

If the tx's `to` is to the creation address

Returns **Boolean** 

## validate

[index.js:281-296](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L281-L296 "Source code on GitHub")

validates the signature and checks to see if it has enough gas

**Parameters**

-   `stringError` **[Boolean]** whether to return a string with a dscription of why the validation failed or return a Bloolean (optional, default `false`)

Returns **Boolean or String** 

## verifySignature

[index.js:208-226](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L208-L226 "Source code on GitHub")

Determines if the signature is valid

Returns **Boolean** 

## from

[index.js:115-119](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L115-L119 "Source code on GitHub")

**Properties**

-   `from` **Buffer** (read only) sender address of this transaction, mathematically derived from other parameters.

## serialize

[index.js:108-108](https://github.com/ethereumjs/ethereumjs-tx/blob/782b0ccfcb4dfdba0291aa02a1063e28f9034ae9/index.js#L108-L108 "Source code on GitHub")

Returns the rlp encoding of the transaction

Returns **Buffer** 

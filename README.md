# ethereumjs-utils
A collection of utily function for ethereum

# API
### properties
 - `MAX_INTEGER`  - The max interger that the VM can handle

## methods 
### `zeros(number)`
Returns 256 bit `Buffer` filled with 0s
- `number` - the number bytes to to return

### `SHA3_RLP_ARRAY`
Return an SHA3-256 hash of the rlp of `null`

### `trimZeros(toTrim)`
Trims leading zeros from a `Buffer` or an `Array`
- `toTrim`

### `pad256(toPad)`
Pads an `Array` or `Buffers` with leading zeros till it has 256 bits
- `toPad`

### `unpad(val)
unpads an `Array` or `Buffers` with removing leading zeros
- `val`

### `intToHex(int)`
Converts an `Integer` into a hex `String`
- `int`

### `intToBuffer(int)`
Converts an `Integer` to a `Buffer`
- `int`

### `bufferToInt(buf)`
converts a `Buffer` to an `Interger`
- `buf`

### `fromSigned(buf)`
interpets a `Buffer` as a signed `Integer` and returns a `Bignum`
- `buf`

### `toUnsigne(num)`
Converts a `bignum` to an unsigned interger and returns it as a `buffer`
- `num` - a `bignum`

### `privToAddress(privateKey)`
Returns the ethereum address of a given private key
- `privateKey`

### `pubToAddress(pubKey)`
Returns the ethereum address of a given public key
- `pubKey` - the public key as a `buffer`

### `defineProperties(self, fields)`
defines properties on a `Object`
- `self` - the `Object` to define properties on
- `fields` - an array fields to define

### `validate(fields, data)`
Validate defined fields
- `fields`
- `data`

### `printBA(ba)`
Print a Buffer Array
- `ba` - an `Array` of `Buffers`

### `BAToJSON(ba)`
converts a buffer array to JSON
- `ba` - an `Array` of `Buffers`

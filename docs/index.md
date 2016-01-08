# Block

[index.js:19-67](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L19-L67 "Source code on GitHub")

Creates a new block object

**Parameters**

-   `data` **Array or Buffer or Object** 

**Properties**

-   `header` **Header** the block's header
-   `uncleList` **Array&lt;Header&gt;** an array of uncle headers
-   `raw` **Array&lt;Buffer&gt;** an array of buffers containing the raw blocks.

## genTxTrie

[index.js:126-134](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L126-L134 "Source code on GitHub")

Generate transaction trie. The tx trie must be generated before the transaction trie can
be validated with `validateTransactionTrie`

**Parameters**

-   `cb` **Function** the callback

## hash

[index.js:73-75](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L73-L75 "Source code on GitHub")

Produces a hash the RLP of the block

## isGenesis

[index.js:82-84](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L82-L84 "Source code on GitHub")

Determines if a given block is the genesis block

Returns **** Boolean

## serialize

[index.js:99-118](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L99-L118 "Source code on GitHub")

Produces a serialization of the block.

**Parameters**

-   `rlpEncode` **Boolean** whether to rlp encode the block or not

## toJSON

[index.js:281-300](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L281-L300 "Source code on GitHub")

Converts the block toJSON

**Parameters**

-   `labeled` **Bool** whether to create an labeled object or an array

Returns **Object** 

## validate

[index.js:180-214](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L180-L214 "Source code on GitHub")

Validates the entire block. Returns a string to the callback if block is invalid

**Parameters**

-   `blockChain` **BlockChain** the blockchain that this block wants to be part of
-   `cb` **Function** the callback which is given a `String` if the block is not valid

## validateTransactions

[index.js:156-172](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L156-L172 "Source code on GitHub")

Validates the transactions

**Parameters**

-   `stringError` **[Boolean]** whether to return a string with a dscription of why the validation failed or return a Bloolean (optional, default `false`)

Returns **Boolean** 

## validateTransactionsTrie

[index.js:141-148](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L141-L148 "Source code on GitHub")

Validates the transaction trie

Returns **Boolean** 

## validateUncles

[index.js:237-273](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L237-L273 "Source code on GitHub")

Validates the uncles that are in the block if any. Returns a string to the callback if uncles are invalid

**Parameters**

-   `blockChaina` **Blockchain** an instance of the Blockchain
-   `blockChain`  
-   `cb` **Function** the callback

## validateUnclesHash

[index.js:221-229](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/index.js#L221-L229 "Source code on GitHub")

Validates the uncle's hash

Returns **Boolean** 

# BlockHeader

[header.js:23-80](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/header.js#L23-L80 "Source code on GitHub")

An object that repersents the block header

**Parameters**

-   `data` **Array** raw data, deserialized

**Properties**

-   `parentHash` **Buffer** the blocks' parent's hash
-   `uncleHash` **Buffer** sha3(rlp_encode(uncle_list))
-   `coinbase` **Buffer** the miner address
-   `stateRoot` **Buffer** The root of a Merkle Patricia tree
-   `transactionTrie` **Buffer** the root of a Trie containing the transactions
-   `receiptTrie` **Buffer** the root of a Trie containing the transaction Reciept
-   `bloom` **Buffer** 
-   `difficulty` **Buffer** 
-   `number` **Buffer** the block's height
-   `gasLimit` **Buffer** 
-   `gasUsed` **Buffer** 
-   `timestamp` **Buffer** 
-   `extraData` **Buffer** 
-   `raw` **Array&lt;Buffer&gt;** an array of buffers containing the raw blocks.

## canonicalDifficulty

[header.js:88-125](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/header.js#L88-L125 "Source code on GitHub")

Returns the canoncical difficulty of the block

**Parameters**

-   `parentBlock` **Block** the parent `Block` of the this header

Returns **BN** 

## hash

[header.js:221-223](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/header.js#L221-L223 "Source code on GitHub")

Returns the sha3 hash of the blockheader

Returns **Buffer** 

## isGenesis

[header.js:230-232](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/header.js#L230-L232 "Source code on GitHub")

checks if the blockheader is a genesis header

Returns **Boolean** 

## validate

[header.js:161-214](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/header.js#L161-L214 "Source code on GitHub")

Validates the entire block header

**Parameters**

-   `blockChain` **Blockchain** the blockchain that this block is validating against
-   `blockchain`  
-   `height` **[Bignum]** if this is an uncle header, this is the height of the block that is including it
-   `cb` **Function** the callback function. The callback is given an `error` if the block is invalid

## validateDifficulty

[header.js:133-136](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/header.js#L133-L136 "Source code on GitHub")

checks that the block's `difficuly` matches the canonical difficulty

**Parameters**

-   `parentBlock` **Block** this block's parent

Returns **Boolean** 

## validateGasLimit

[header.js:144-152](https://github.com/ethereum/ethereumjs-block/blob/cd8e30e292d93f06e70342013a4725aaaaf94ab6/header.js#L144-L152 "Source code on GitHub")

Validates the gasLimit

**Parameters**

-   `parentBlock` **Block** this block's parent

Returns **Boolean** 

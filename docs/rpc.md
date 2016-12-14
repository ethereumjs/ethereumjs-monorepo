# Block

[index.js:18-63](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L18-L63 "Source code on GitHub")

Creates a new block object

**Parameters**

-   `data` **Array or Buffer or Object** 

**Properties**

-   `header` **Header** the block's header
-   `uncleList` **Array&lt;Header&gt;** an array of uncle headers
-   `raw` **Array&lt;Buffer&gt;** an array of buffers containing the raw blocks.

## genTxTrie

[index.js:147-155](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L147-L155 "Source code on GitHub")

Generate transaction trie. The tx trie must be generated before the transaction trie can
be validated with `validateTransactionTrie`

**Parameters**

-   `cb` **Function** the callback

## hash

[index.js:71-73](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L71-L73 "Source code on GitHub")

Produces a hash the RLP of the block

## isGenesis

[index.js:80-82](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L80-L82 "Source code on GitHub")

Determines if a given block is the genesis block

Returns **** Boolean

## isHomestead

[index.js:89-91](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L89-L91 "Source code on GitHub")

Determines if a given block part of homestead or not

Returns **** Boolean

## isHomesteadReprice

[index.js:98-100](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L98-L100 "Source code on GitHub")

Determines if a given block part of homestead reprice or not

Returns **** Boolean

## serialize

[index.js:120-139](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L120-L139 "Source code on GitHub")

Produces a serialization of the block.

**Parameters**

-   `rlpEncode` **Boolean** whether to rlp encode the block or not

## setGenesisParams

[index.js:106-113](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L106-L113 "Source code on GitHub")

turns the block in to the canonical genesis block

## toJSON

[index.js:298-317](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L298-L317 "Source code on GitHub")

Converts the block toJSON

**Parameters**

-   `labeled` **Bool** whether to create an labeled object or an array

Returns **Object** 

## validate

[index.js:200-231](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L200-L231 "Source code on GitHub")

Validates the entire block. Returns a string to the callback if block is invalid

**Parameters**

-   `blockChain` **BlockChain** the blockchain that this block wants to be part of
-   `cb` **Function** the callback which is given a `String` if the block is not valid

## validateTransactions

[index.js:177-192](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L177-L192 "Source code on GitHub")

Validates the transactions

**Parameters**

-   `stringError` **[Boolean]** whether to return a string with a dscription of why the validation failed or return a Bloolean (optional, default `false`)

Returns **Boolean** 

## validateTransactionsTrie

[index.js:162-169](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L162-L169 "Source code on GitHub")

Validates the transaction trie

Returns **Boolean** 

## validateUncles

[index.js:254-290](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L254-L290 "Source code on GitHub")

Validates the uncles that are in the block if any. Returns a string to the callback if uncles are invalid

**Parameters**

-   `blockChaina` **Blockchain** an instance of the Blockchain
-   `blockChain`  
-   `cb` **Function** the callback

## validateUnclesHash

[index.js:238-246](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/index.js#L238-L246 "Source code on GitHub")

Validates the uncle's hash

Returns **Boolean** 

# blockFromRpc

[from-rpc.js:12-62](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/from-rpc.js#L12-L62 "Source code on GitHub")

Creates a new block object from Ethereum JSON RPC.

**Parameters**

-   `blockParams` **Object** Ethereum JSON RPC of block (eth_getBlockByNumber)
-   `Optional` **Array&lt;Object&gt;** list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)
-   `uncles`  

# BlockHeader

[header.js:23-80](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/header.js#L23-L80 "Source code on GitHub")

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

[header.js:88-125](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/header.js#L88-L125 "Source code on GitHub")

Returns the canoncical difficulty of the block

**Parameters**

-   `parentBlock` **Block** the parent `Block` of the this header

Returns **BN** 

## hash

[header.js:221-223](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/header.js#L221-L223 "Source code on GitHub")

Returns the sha3 hash of the blockheader

Returns **Buffer** 

## isGenesis

[header.js:230-232](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/header.js#L230-L232 "Source code on GitHub")

checks if the blockheader is a genesis header

Returns **Boolean** 

## isHomestead

[header.js:239-241](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/header.js#L239-L241 "Source code on GitHub")

Determines if a given block part of homestead or not

Returns **** Boolean

## isHomesteadReprice

[header.js:248-250](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/header.js#L248-L250 "Source code on GitHub")

Determines if a given block part of Homestead Reprice (EIP150) or not

Returns **** Boolean

## validate

[header.js:161-214](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/header.js#L161-L214 "Source code on GitHub")

Validates the entire block header

**Parameters**

-   `blockChain` **Blockchain** the blockchain that this block is validating against
-   `blockchain`  
-   `height` **[Bignum]** if this is an uncle header, this is the height of the block that is including it
-   `cb` **Function** the callback function. The callback is given an `error` if the block is invalid

## validateDifficulty

[header.js:133-136](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/header.js#L133-L136 "Source code on GitHub")

checks that the block's `difficuly` matches the canonical difficulty

**Parameters**

-   `parentBlock` **Block** this block's parent

Returns **Boolean** 

## validateGasLimit

[header.js:144-152](https://github.com/ethereumjs/ethereumjs-block/blob/34d3eefb6e073a0bc209c5fba8e81376ff86fb91/header.js#L144-L152 "Source code on GitHub")

Validates the gasLimit

**Parameters**

-   `parentBlock` **Block** this block's parent

Returns **Boolean** 

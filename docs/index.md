# SecureTrie

[secure.js:13-16](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/secure.js#L13-L16 "Source code on GitHub")

You can create a secure Trie where the keys are automatically hashed using **SHA3** by using `require('merkle-patricia-tree/secure')`. It has the same methods and constuctor as `Trie`

# Trie

[baseTrie.js:26-57](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L26-L57 "Source code on GitHub")

Use `require('merkel-patricia-tree')` for the base interface. In Ethereum applications stick with the Secure Trie Overlay `require('merkel-patricia-tree/secure')`. The API for the raw and the secure interface are about the same

**Parameters**

-   `db` **[Object]** An instance of [levelup](https://github.com/rvagg/node-levelup/) or a compatible API. If the db is `null` or left undefined, then the trie will be stored in memory via [memdown](https://github.com/rvagg/memdown)
-   `root` **[Buffer or String]** `A hex`String`or`Buffer` for the root of a previously stored trie

**Properties**

-   `root` **Buffer** The current root of the `trie`
-   `isCheckpoint` **Boolean** determines if you are saving to a checkpoint or directly to the db
-   `EMPTY_TRIE_ROOT` **Buffer** the Root for an empty trie

## batch

[baseTrie.js:710-722](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L710-L722 "Source code on GitHub")

The given hash of operations (key additions or deletions) are executed on the DB

**Parameters**

-   `ops` **Array** 
-   `cb` **Function** 

**Examples**

```javascript
var ops = [
   { type: 'del', key: 'father' }
 , { type: 'put', key: 'name', value: 'Yuri Irsenovich Kim' }
 , { type: 'put', key: 'dob', value: '16 February 1941' }
 , { type: 'put', key: 'spouse', value: 'Kim Young-sook' }
 , { type: 'put', key: 'occupation', value: 'Clown' }
]
trie.batch(ops)
```

## checkRoot

[baseTrie.js:730-735](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L730-L735 "Source code on GitHub")

Checks if a given root exists

**Parameters**

-   `root` **Buffer** 
-   `cb` **Function** 

## createReadStream

[baseTrie.js:685-687](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L685-L687 "Source code on GitHub")

The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.

Returns **stream.Readable** Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

## del

[baseTrie.js:121-139](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L121-L139 "Source code on GitHub")

deletes a value given a `key`

**Parameters**

-   `key` **Buffer or String** 
-   `cb` **Function** the callback `Function`

## delRaw

[baseTrie.js:211-218](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L211-L218 "Source code on GitHub")

Removes a raw value in the underlying db

**Parameters**

-   `key` **Buffer or String** 
-   `cb` **Function** A callback `Function`, which is given the argument `err` - for errors that may have occured

## get

[baseTrie.js:65-78](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L65-L78 "Source code on GitHub")

Gets a value given a `key`

**Parameters**

-   `key` **Buffer or String** the key to search for
-   `callback` **Function** A callback `Function` which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`


## getRaw

[baseTrie.js:147-163](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L147-L163 "Source code on GitHub")

Retrieves a raw value in the underlying db

**Parameters**

-   `key` **Buffer** 
-   `cb` **Function** A callback `Function`, which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`.
 

## put

[baseTrie.js:87-113](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L87-L113 "Source code on GitHub")

Stores a given `value` at the given `key`

**Parameters**

-   `key` **Buffer or String** 
-   `Value` **Buffer or String** 
-   `callback` **Function** A callback `Function` which is given the argument `err` - for errors that may have occured

## putRaw

[baseTrie.js:202-202](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L202-L202 "Source code on GitHub")

Writes a value directly to the underlining db

**Parameters**

-   `key` **Buffer or String** The key as a `Buffer` or `String`
-   `value` **Buffer** The value to be stored
-   `callback` **Function** A callback `Function`, which is given the argument `err` - for errors that may have occured

## checkpoint

[checkpoint-interface.js:37-44](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/checkpoint-interface.js#L37-L44 "Source code on GitHub")

Creates a checkpoint that can later be reverted to or committed. After this is called, no changes to the trie will be permanently saved until `commit` is called

## commit

[checkpoint-interface.js:51-67](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/checkpoint-interface.js#L51-L67 "Source code on GitHub")

commits a checkpoint to disk

## revert

[checkpoint-interface.js:74-89](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/checkpoint-interface.js#L74-L89 "Source code on GitHub")

Reverts the trie to the state it was at when `checkpoint` was first called.

**Parameters**

-   `cb` **Function** the callback


# Internal Util Functions
These are not exposed. 

## addHexPrefix

[trieNode.js:164-179](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/trieNode.js#L164-L179 "Source code on GitHub")

**Parameters**

-   `dataArr` **Array** 
-   `key`  
-   `terminator`  

Returns **Buffer** returns buffer of encoded data
hexPrefix

## asyncFirstSeries

[util.js:62-78](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/util.js#L62-L78 "Source code on GitHub")

Take a collection of async fns, call the cb on the first to return a truthy value.
If all run without a truthy result, return undefined

**Parameters**

-   `array`  
-   `iterator`  
-   `cb`  

## callTogether

[util.js:36-56](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/util.js#L36-L56 "Source code on GitHub")

Take two or more functions and returns a function  that will execute all of
the given functions


**Parameters**

-   `cb` **Function** the callback

## doKeysMatch

[util.js:27-30](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/util.js#L27-L30 "Source code on GitHub")

Compare two 'nibble array' keys

**Parameters**

-   `keyA`  
-   `keyB`  

## matchingNibbleLength

[util.js:16-22](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/util.js#L16-L22 "Source code on GitHub")

Returns the number of in order matching nibbles of two give nibble arrayes

**Parameters**

-   `nib1` **Array** 
-   `nib2` **Array** 

## _findPath

[baseTrie.js:252-300](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L252-L300 "Source code on GitHub")

Trys to find a path to the node for the given key.
It returns a `stack` of nodes to the closet node.

**Parameters**

-   `Function`  cb - the callback function. Its is given the following
    arguments-   err - any errors encontered
    -   node - the last node found
    -   keyRemainder - the remaining key nibbles not accounted for
    -   stack - an array of nodes that forms the path to node we are searching for
-   `targetKey`  
-   `cb`  

## _saveStack

[baseTrie.js:502-529](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L502-L529 "Source code on GitHub")

saves a stack

**Parameters**

-   `key` **Array** the key. Should follow the stack
-   `stack` **Array** a stack of nodes to the value given by the key
-   `opStack` **Array** a stack of levelup operations to commit at the end of this funciton
-   `cb` **Function** 

## _updateNode

[baseTrie.js:358-423](https://github.com/wanderer/merkle-patricia-tree/blob/dc436426d717fed408f4d46fed23f6d26d03d39d/baseTrie.js#L358-L423 "Source code on GitHub")

Updates a node

**Parameters**

-   `key` **Buffer** 
-   `value` **Buffer or String** 
-   `keyRemainder` **Array** 
-   `stack` **Array** -
-   `cb` **Function** the callback

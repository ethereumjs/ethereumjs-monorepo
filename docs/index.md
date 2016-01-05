# _findPath

[baseTrie.js:227-275](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/baseTrie.js#L227-L275 "Source code on GitHub")

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

# _saveStack

[baseTrie.js:477-504](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/baseTrie.js#L477-L504 "Source code on GitHub")

saves a stack

**Parameters**

-   `key` **Array** the key. Should follow the stack
-   `stack` **Array** a stack of nodes to the value given by the key
-   `opStack` **Array** a stack of levelup operations to commit at the end of this funciton
-   `cb` **Function** 

# _updateNode

[baseTrie.js:333-398](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/baseTrie.js#L333-L398 "Source code on GitHub")

Updates a node

**Parameters**

-   `key` **Buffer** 
-   `value` **Buffer or String** 
-   `keyRemainder` **Array** 
-   `stack` **Array** -
-   `cb` **Function** the callback

# batch

[baseTrie.js:672-684](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/baseTrie.js#L672-L684 "Source code on GitHub")

runs a `hash` of command

**Parameters**

-   `ops` **Object** 
-   `cb` **Function** 

# checkRoot

[baseTrie.js:692-697](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/baseTrie.js#L692-L697 "Source code on GitHub")

Checks if a given root exists

**Parameters**

-   `root` **Buffer** 
-   `cb` **Function** 

# get

[baseTrie.js:55-68](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/baseTrie.js#L55-L68 "Source code on GitHub")

Gets a value given a key

**Parameters**

-   `key` **String** the key to search for
-   `cb`  

# getRaw

[baseTrie.js:130-146](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/baseTrie.js#L130-L146 "Source code on GitHub")

Writes a value directly to the underlining db

**Parameters**

-   `key` **Buffer** 
-   `cb`  

# put

[baseTrie.js:76-102](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/baseTrie.js#L76-L102 "Source code on GitHub")

Stores a key value

**Parameters**

-   `key` **Buffer or String** 
-   `Value` **Buffer or String** 
-   `value`  
-   `cb`  

# putRaw

[baseTrie.js:184-184](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/baseTrie.js#L184-L184 "Source code on GitHub")

Writes a value directly to the underlining db

**Parameters**

-   `key` **Buffer** 
-   `key` **Buffer** 

# addHexPrefix

[trieNode.js:164-179](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/trieNode.js#L164-L179 "Source code on GitHub")

**Parameters**

-   `dataArr` **Array** 
-   `key`  
-   `terminator`  

Returns **Buffer** returns buffer of encoded data
hexPrefix

# asyncFirstSeries

[util.js:62-78](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/util.js#L62-L78 "Source code on GitHub")

Take a collection of async fns, call the cb on the first to return a truthy value.
If all run without a truthy result, return undefined

**Parameters**

-   `array`  
-   `iterator`  
-   `cb`  

# callTogether

[util.js:36-56](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/util.js#L36-L56 "Source code on GitHub")

Take two or more functions and returns a function  that will execute all of
the given functions

# doKeysMatch

[util.js:27-30](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/util.js#L27-L30 "Source code on GitHub")

Compare two 'nibble array' keys

**Parameters**

-   `keyA`  
-   `keyB`  

# matchingNibbleLength

[util.js:16-22](https://github.com/wanderer/merkle-patricia-tree/blob/ebfa40ebff2c0f99d4b9dcd1f306a802ddfbcef9/util.js#L16-L22 "Source code on GitHub")

Returns the number of in order matching nibbles of two give nibble arrayes

**Parameters**

-   `nib1` **Array** 
-   `nib2` **Array** 

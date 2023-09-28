# Ethereum's Merkle Patricia Trees - An Interactive JavaScript Tutorial - By [Gabriel Rocheleau](https://github.com/gabrocheleau)

Merkle Patricia Trees are the fundamental data structure on which Ethereum is built. In this tutorial, we will explore the inner workings of Ethereum's Merkle Patricia Trees, using follow-along examples written in JavaScript. This tutorial uses the [trie package](../../) from the EthereumJS monorepo.

## Preliminary information

If you're not familiar with Merkle Trees, I recommend you begin by reading [Vitalik's "Merkling in Ethereum"](https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/). This article will give you a basic idea of what Merkle Trees are, why they're useful, and give you a glimpse of the significant advantages of Merkle Patricia Trees over standard Merkle Trees.

A Merkle Patricia Tree\* is the combination of a:

- **Patricia Trie**: An efficient Radix Trie, a data structure in which "keys" represent the path one has to take to reach a node
- **Merkle Tree**: A hash tree in which each node's hash is computed from its child nodes hashes.

We'll begin by exploring the "Patricia Trie" part of Merkle Patricia Trees, and then integrate their "Merkle Tree" part.

\*_Note that since Merkle Patricia Trees are created from "Tries" and "Trees", they are sometimes referred to as "Merkle Patricia Trees", and sometimes as "Merkle Patricia Tries". In this tutorial, I'll try using the word "Tree" when talking about "Merkle Patricia Trees" or "Merkle Trees", and "Trie" when talking about "Radix Tries" or "Patricia Tries". Ultimately, this doesn't matter too much, so don't get too hung up on these two terms._

## Setting up our environment

We'll use nodeJS to run our JavaScript examples and npm to install the necessary packages.

First, we need to clone the repository from GitHub. We then install the relevant packages with npm install.

```bash
git clone git@github.com:ethereumjs/ethereumjs-monorepo.git
cd ethereumjs-monorepo/
npm install
cd packages/trie
```

Installing the packages should take a few minutes. Once installed, you will be able to follow along using the corresponding numbered examples in the /examples folder. To run an example, simply run the command `node example-name.js`

## 1. Creating and Updating Tries

At their most basic, Merkle Patricia Trees allow us to store and retrieve key-value pairs.

### Example 1a - Creating and Updating a Base Trie

Let's begin right away with a simple example. Don't worry if things aren't too clear for now, they will become clearer as we go. In this example, we'll create an empty trie:

```jsx
const { Trie } = require('@ethereumjs/trie') // We import the library required to create a basic Merkle Patricia Tree
const { bytesToHex, bytesToUtf8, utf8ToBytes } = require('@ethereumjs/util')

const trie = new Trie() // We create an empty Merkle Patricia Tree
console.log('Empty trie root (Bytes): ', bytesToHex(trie.root())) // The trie root (32 bytes)
```

and then store and retrieve a single key-value pair within it. Note that we needed to convert the strings (`testKey` and `testValue`) to bytes, as that is what the Trie methods expect:

```jsx
async function test() {
  const key = utf8ToBytes('testKey')
  const value = utf8ToBytes('testValue')
  await trie.put(key, value) // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const retrievedValue = await trie.get(key) // We retrieve (using "get") the value at key "testKey"
  console.log('Value (Bytes): ', bytesToHex(retrievedValue))
  console.log('Value (String): ', bytesToUtf8(retrievedValue))
  console.log('Updated trie root:', bytesToHex(trie.root())) // The new trie root (32 bytes)
}

test()

// RESULT
Empty trie root (Bytes):  0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
Value (Bytes):  0x7465737456616c7565
Value (String):  testValue
Updated trie root: 0x8e8143672133dd5ab00dfc4b011460ea2a7b00d910dc4278942ae9105cb62074
```

Quite simple. As expected, we can retrieve our value using the key. We can also note that the root hash of the tree has automatically been updated. We'll explore what tree roots stand for later; for now, simply know that each distinct tree will have a distinct root (we can therefore quickly verify if two trees are identical by comparing their roots!).

However, the example above does not reflect exactly how key-value pairs are stored and retrieved in Ethereum's Merkle Patricia Trees. Here are some things to keep in mind:

- As mentioned, keys and values are stored and retrieved as raw bytes. We already covered that in the previous example by converting our strings to bytes using `utf8ToBytes`.
- Values undergo an additional transformation before they are stored. They are encoded using the [Recursive Length Prefix encoding function](https://github.com/ethereum/wiki/wiki/RLP). This allows the serialization of strings and arrays. The "Trie" class does that automatically.
- Last but not least: in Ethereum, the keys also undergo another transformation: they are converted using a hash function (keccak256). The Trie class **does not** do this.

### Example 1b - Manually Creating and Updating a Secure Trie

Let's retry the example above while respecting the rules we just mentioned. We will therefore use the keccak256 hash of the key instead of the key itself.

Here's what this looks like:

```jsx
const trie = new Trie() // We create an empty Merkle Patricia Tree
console.log('Empty trie root (Bytes): ', bytesToHex(trie.root())) // The trie root (32 bytes)

async function test() {
  await trie.put(keccak256(utf8ToBytes('testKey')), utf8ToBytes('testValue')) // We update (using "put") the trie with the key-value pair hash("testKey"): "testValue"
  const value = await trie.get(keccak256(utf8ToBytes('testKey'))) // We retrieve (using "get") the value at hash("testKey")
  console.log('Value (Bytes): ', bytesToHex(value))
  console.log('Value (String): ', bytesToUtf8(value))
  console.log('Updated trie root:', bytesToHex(trie.root())) // The new trie root (32 bytes)
}

test()

// RESULT
Empty trie root (Bytes):  0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
Value (Bytes):  0x7465737456616c7565
Value (String):  testValue
Updated trie root: 0xbeade913ab37dca0dca2e42924b918c2a1cac457833bd82b9e3245decb87d0fb
```

Nothing spectacular: only the root hash of the tree has changed, as the key has changed from hexToBytes("testKey") to keccak256(hexToBytes("testKey")).

### Example 1c - Automatically Creating and Updating a Secure Trie

Fortunately, we also have an option called "useKeyHashing" that automatically takes care of the keccak256 hashing for us. We can see that it outputs the same root hash as example1b.js

```jsx
const trie = new Trie({ useKeyHashing: true }) // We create an empty Merkle Patricia Tree with key hashing enabled
console.log('Empty trie root (Bytes): ', bytesToHex(trie.root())) // The trie root (32 bytes)

async function test() {
  await trie.put(utf8ToBytes('testKey'), utf8ToBytes('testValue')) // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const value = await trie.get(utf8ToBytes('testKey')) // We retrieve (using "get") the value at key "testKey"
  console.log('Value (Bytes): ', bytesToHex(value))
  console.log('Value (String): ', bytesToUtf8(value))
  console.log('Updated trie root:', bytesToHex(trie.root())) // The new trie root (32 bytes)
}

test()

// RESULT
Empty trie root (Bytes):  0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
Value (Bytes):  0x7465737456616c7565
Value (String):  testValue
Updated trie root: 0xbeade913ab37dca0dca2e42924b918c2a1cac457833bd82b9e3245decb87d0fb // Same hash as the previous example.
```

To make the examples easier to follow, we won't be using the keccak256 of the keys (or the `useKeyHashing` option) in this tutorial. However, keep in mind that in Ethereum's Merkle Patricia Trees, keys are always hashed. If you're curious, the reason for hashing the keys is balancing the tree.

### Example 1d - Deleting a Key-Value Pair from a Trie

In addition to retrieving (using the method `get`) and adding (using the method `put`) key-value pairs to our tree, we can delete key-value pairs (using the method `del`).

```jsx
async function test() {
  const key = utf8ToBytes('testKey')
  const value = utf8ToBytes('testValue')
  await trie.put(key, value) // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const valuePre = await trie.get(key) // We retrieve (using "get") the value at key "testKey"
  console.log('Value (String): ', bytesToUtf8(valuePre)) // We retrieve our value
  console.log('Updated trie root:', bytesToHex(trie.root())) // The new trie root

  await trie.del(key)
  const valuePost = await trie.get(key) // We try to retrieve the value at (deleted) key "testKey"
  console.log('Value at key "testKey": ', valuePost) // Key not found. Value is therefore null.
  console.log('Trie root after deletion:', bytesToHex(trie.root())) // Our trie root is back to its initial value
}

test()

// RESULT
Empty trie root:  0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
Value (String):  testValue
Updated trie root: 0x8e8143672133dd5ab00dfc4b011460ea2a7b00d910dc4278942ae9105cb62074
Value at key "testKey":  null
Trie root after deletion: 0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
```

Quite simple, isn't it? Notice that our tree root after deletion is the same as our initial tree root. This is exactly what we should expect: having deleted the only value-key pair from our tree, we are left with an empty tree!

So far, we've seen that our "trees/tries" behave like normal key-value dictionaries. They also produce consistent but random (i.e. unpredictable) hashes: the same tree generates the same hash every time.

## 2. A Deeper Look at Individual Nodes

This is all great, but we haven't yet really dived into the inner workings of Merkle Patricia Trees; we've only stored, retrieved and deleted key-value pairs. There are much more interesting mysteries lying ahead of us!

As we said, in a standard "trie", the key is a path we follow step-by-step (i.e. one hexadecimal value at a time) to reach a destination: our value. Now, every time we take a step along that trie, we step on what's called a "node". In Patricia Tries, there are different kinds of nodes:

1. `null` A non-existent node.
2. `branch` A node that links ("branches out") to up to 16 distinct child notes. A branch node can also itself have a value.
3. `leaf` An "end-node" that contains the final part of the path and a value.
4. `extension` A "shortcut" node that provides a partial path and a destination. Extension nodes are used to "bypass" unnecessary nodes when only one valid branch exists for a sequence of nodes.

For more technical details, [refer to the documentation](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/)

To improve the efficiency of standard tries, Patricia tries provide a new type of node: `extension` nodes. An `extension` node can replace useless sequences of branches that contain only one valid index. Don't worry if this is unclear for now, we will go through simple examples.

### Example 2a - Creating and looking up a null node

This first example is quite straightforward. We'll simply look up a node (using `findPath`, a method that returns the node at a certain path) with a non-existent path.

```jsx
async function test() {
  const node1 = await trie.findPath(utf8ToBytes('testKey')) // We attempt to retrieve the node using our key "testKey"
  console.log('Node 1: ', node1.node) // null
}

test()

// RESULT
Node 1:  null
```

Nothing surprising here, there is no node associated with that path, so the node is null.

### Example 2b - Creating and looking up a branch node

Creating a branch node is a bit more complicated. For a branch to exist, we need to create a common path that eventually diverges.

First, notice how similar the following keys are (specifically, look at the bytes):

```jsx
console.log(bytesToHex(utf8ToBytes('testKey')))
console.log(bytesToHex(utf8ToBytes('testKey0')))
console.log(bytesToHex(utf8ToBytes('testKeyA')))

// RESULT (BYTES)
0x746573744b6579
0x746573744b657930
0x746573744b657941
```

We can see that the bytes representations of our keys branch off at byte `79`. This makes sense: `79` stands for the letter `y`. Let's now add those keys to our trie.

```jsx
// Add a key-value pair to the trie for each key
await trie.put(utf8ToBytes('testKey'), utf8ToBytes('testValue'))
await trie.put(utf8ToBytes('testKey0'), utf8ToBytes('testValue0'))
await trie.put(utf8ToBytes('testKeyA'), utf8ToBytes('testValueA'))

const node1 = await trie.findPath(utf8ToBytes('testKey')) // We retrieve the node at the "branching" off of the keys
console.log('Node: ', node1.node) // A branch node!

// RESULTS
Node 1: BranchNode {
  _branches: [
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    [ [Uint8Array], [Uint8Array] ],
    [ [Uint8Array], [Uint8Array] ],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) []
  ],
  _value: Uint8Array(9) [
    116, 101, 115, 116,
     86,  97, 108, 117,
    101
  ]
}
```

And indeed, the node at path "testKey" is a branch, containing 16 branches and a value. Let's first look at the value located at the branch itself.

```jsx
console.log('Node value: ', bytesToUtf8(node1.node._value)) // The branch node's value

// RESULT
Node 1 value:  testValue
```

Note that it's possible for a branch node to not have a value itself, but only branches. This would simply mean that the keys (i.e. the paths) branch off at a certain point, but that there is no end-value assigned at that specific point.

Let's take a closer look at the branches of our branch node.

```jsx
console.log('Node branches: ', node1.node._branches)

// RESULT
Node 1 branches:  [
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  [
    Uint8Array(1) [ 48 ],
    Uint8Array(10) [
      116, 101, 115, 116,
       86,  97, 108, 117,
      101,  48
    ]
  ],
  [
    Uint8Array(1) [ 49 ],
    Uint8Array(10) [
      116, 101, 115, 116,
       86,  97, 108, 117,
      101,  65
    ]
  ],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) []
]
```

14/16 of its branches are empty (`Uint8Array`s). Only the branches at indexes `3` and `4` contain values. Now here's an important point. These indexes are not determined at random: **they correspond to the next hex-value of the path of our two keys (hex values `3` and `4`)**. This makes sense, as this is the value at which our keys diverge (converted to hex for easier comparison):

```jsx
// <---- same----> <-> (different)
0x7465737456616c756530 // "testKey0", "0" = 30 in bytes
0x7465737456616c756541 // "testKeyA", "A" = 41 in bytes
```

Going back to the branches above, we see that our two branches (at index `3` and `4`) are (converted to hex again for better readability):

Node 1 branch 3 (hex): 0x30 - 0x7465737456616c756530
Node 1 branch 4 (hex): 0x31 - 0x7465737456616c756541

```jsx
[path:  0x30  | value:  0x7465737456616c756530] // going down the path of "testKey0"
[path:  0x31  | value:  0x7465737456616c756541] // going down the path of "testKeyA"
```

I'm getting ahead of myself here, but here's a spoiler: these are leaf nodes. We see that each line contains two byte arrays (byte arrays are sequences of bytes). And indeed: leaf nodes are arrays containing two items. The first item is the remaining path (we'll get back to what the hex values stand for in a minute), while the second byte array is the value at that path. We can confirm that the values are what we'd expect:

```jsx
console.log('Value of branch at index 3: ', bytesToUtf8(node1.node._branches[3][1]))
console.log('Value of branch at index 4: ', bytesToUtf8(node1.node._branches[4][1]))

// RESULT
Value of branch at index 3:  testValue0
Value of branch at index 4:  testValueA
```

Now here's a question for you:

**What type of node do you think exists at path "testKe"?** After all, this is also a common path, the first part of our 3 keys. Let's try it:

```jsx
  const node2 = await trie.findPath(utf8ToBytes('testKe')) // We retrieve the node at "testKe"
  console.log('Node 2: ', node2.node)

// RESULT
Node 2:  null
```

A null node! Did you expect a branch node?

This reveals a **key difference between standard ("Radix") tries and Patricia tries**. In standards tries, each step of the "path" would be a branch itself (i.e. branch node at `0x7>`, `0x74`, `0x746`, `0x7465`, and so on). However, creating a branch node for every step of the path is inefficient when there is only one valid "branch" for many of those steps. This is inefficient because each branch is a 17-item array, so using them to store only one non-null value is wasteful. Patricia tries avoid these unnecessary `branch` nodes by creating `extension` nodes at the beginning of the common path to act as "shortcuts". This explains why there is no branch node at key "testKe": it's bypassed by an extension node that begins higher-up (i.e. earlier in the path) in the trie.

### The Encoded Path in Leaf and Extension Nodes

We saw in one of our previous examples that the individual branches were in fact pointing to leaf nodes:

```jsx
[path:  0x30  | value:  0x7465737456616c756530] // leaf node down the path of "testKey0"
[path:  0x31  | value:  0x7465737456616c756541] // leaf node down the path of "testKeyA"
```

As we said above, leaf nodes are arrays that contain two items: `[ remainingPath, value ]`. We can see in the code above that the "remainingPath" of our first leaf node is `0x30`, while the second is `0x31`. What does this mean?

The first hex character `3` indicates whether the node is a leaf node, or an extension node (this is to prevent ambiguity, as both nodes have a similar 2-item structure). This first hex character also indicates whether or not the remaining path is of "odd" or "even" length (required to write complete bytes: this indicates if the first hex character is appended with a `0`).

Here's how this looks like in a table:

```jsx
hex char    bits    |        node type         path length
----------------------------------------------------------
   0        0000    |       extension              even
   1        0001    |       extension              odd
   2        0010    |          leaf                even
   3        0011    |          leaf                odd
```

In our code above, the first hexadecimal character for the encodedPath of both nodes (`0x30` and `0x31`) is `3`. This correctly indicates that the node is of type `leaf` and that the path that follows is of odd length. The second character ( `0x0` and `0x1` respectively) indicates the last part of the path (the last hex character of our key).

With this in mind, let's take a closer look at leaf and extension nodes.

### Example 2c - Looking up a Leaf Node

In the last example, we inferred that the two branches of our branch node (at key/path "testKey") pointed to leaf nodes. We can confirm this by looking one of them up directly

```jsx
const node1 = await trie.findPath(utf8ToBytes('testKey0')) // We retrieve one of the leaf nodes
console.log('Node 1: ', node1.node) // A leaf node! We can see that it contains 2 items: the nibbles and the value
console.log('Node 1 value: ', bytesToUtf8(node1.node._value)) // The leaf node's value

// RESULT
Node 1:  LeafNode {
  _nibbles: [ 0 ],
  _value: Uint8Array(10) [
    116, 101, 115, 116,
     86,  97, 108, 117,
    101,  48
  ],
  _terminator: true
}
Node 1 value:  testValue0
```

Indeed! A leaf node with value "testValue0". The "nibble" indicates the last hex character(s) that differentiate this leaf from the parent branch. Since our branch node was "testKey" (in bytes = `0x7465737456616c7565`) , and since we took the branch corresponding to hex value `3`, we only need the last `0` to complete our full key/path of "testKey0" (in bytes = `0x7465737456616c756530`).

### Example 2d - Creating and Looking Up an Extension Node

To create an extension node, we need to slightly change our keys. We'll keep our branch node at path "testKey", but we'll change the two other keys so that they lead down a lengthy common path.

```jsx
console.log(bytesToHex(utf8ToBytes('testKey')))
console.log(bytesToHex(utf8ToBytes('testKey0001')))
console.log(bytesToHex(utf8ToBytes('testKey000A')))

// RESULT
0x746573744b6579
0x746573744b657930303031
0x746573744b657930303041
```

As you can see, the bytes `303030` (standing for `000` are common to both keys. We therefore should assume an extension that begins at index `3` of the branch node at "testKey". Let's see:

```jsx
await trie.put(utf8ToBytes('testKey'), utf8ToBytes('testValue'))
await trie.put(utf8ToBytes('testKey0001'), utf8ToBytes('testValue0'))
await trie.put(utf8ToBytes('testKey000A'), utf8ToBytes('testValueA'))

const node1 = await trie.findPath(utf8ToBytes('testKey')) // Looking up our branch node
console.log(node1.node) // The branch node

// RESULT
BranchNode {
  _branches: [
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(32) [
       57,  29,  72, 48, 222,   0, 135,  87,
       70, 152,  76, 79, 211, 239,  90,  12,
      247, 202, 123, 64, 249, 194, 138, 206,
      226, 186,  34, 73, 132,  65, 143, 107
    ],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) []
  ],
  _value: Uint8Array(9) [
    116, 101, 115, 116,
     86,  97, 108, 117,
    101
  ]
}
```

As we should expect, there is a branch at index `3`. The branch contains a hash that we can use to lookup the child node:

```jsx
 const node2 = await trie.lookupNode(node1.node._branches[3]) // Looking up the child node from its hash (using lookupNode)
 console.log(node2) // An extension node!

// RESULT
ExtensionNode {
  _nibbles: [ 0, 3, 0, 3, 0 ],
  _value: Uint8Array(32) [
    112, 179, 208,  32, 173, 133, 143, 214,
      0,  40, 164,  35, 233, 143,  29, 153,
    197,  55, 205, 185,  31,  39,  73,  22,
     64,   6, 111, 234, 199, 156,  47, 114
  ],
  _terminator: false
}
```

Awesome! An extension node!

You might have noticed that this child node is a "hash", while in the previous examples, it was the leaf node itself. This is simply because of the way nodes are stored in branch nodes. If the [Recursive Length Prefix](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp) (RLP) encoding of the child node is less than 32 bytes, the node is stored directly. However, if the RLP encoding is equal to or longer than 32 bytes, a hash of the node is stored in the branch node, which can be used to lookup the child node directly.

Similarly to leaf nodes, extension nodes are two-item arrays: `[ encodedPath, hash ]` . The encodedPath (denoted above as "\_nibbles") stands for the "remaining path". In the case of extension nodes this is the path that we "shortcut". Recall our two keys:

```jsx
console.log(bytesToHex(utf8ToBytes('testKey0001')))
console.log(bytesToHex(utf8ToBytes('testKey000A')))

// RESULT
0x746573744b657930303031
0x746573744b657930303041
```

The first part of the path ("testKey" = `0x746573744b6579`) led us to the branch node. Next, taking the branch at index `3` (for hex value `3`) led us to our extension node, which automatically leads us down the path `03030`. Using only two nodes (branch + extension), we are therefore able to "shortcut" the whole `303030` part of the path! With a standard trie, this would have required 6 successive branch nodes!

Again, the value of the extension node leads us down to another node... can you guess what it will be?

```jsx
const node3 = await trie.lookupNode(node2._value)
console.log(node3)

// RESULT
BranchNode {
  _branches: [
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    [ [Uint8Array], [Uint8Array] ],
    [ [Uint8Array], [Uint8Array] ],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) [],
    Uint8Array(0) []
  ],
  _value: Uint8Array(0) []
}
```

Another branch node, itself containing two leaf nodes at indexes `3` and `4`, just like in our previous example!

That's all for the four types of nodes. Congratulations on making it this far: the hardest part of Merkle Patricia Trees is now behind us! Before going further, I encourage you to play with the examples and build your nodes! Try to create and verify one of each type by yourself. If you'd like, you can also go through [this other example](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/#example-trie). It presents the same concepts from a slightly different angle.

## 3. Generating and Verifying Hashes

We're almost there! The only thing we haven't covered is the "Merkle" part of the Merkle Patricia Trees. As you may know, Merkle trees are hash trees that allow us to efficiently verify information. In the context of blockchains, Merkle Trees allow us to answer questions such as "Has this transaction been included in this block?".

In Ethereum's Merkle Patricia Trees, each node is referenced to by its hash. Note that this hash also can be referred to as a "key", which can be confusing. **Note that the hash is not the same as the path we take when going down the trie**.

You can think of paths as a sequence of instructions for a given input, something like "_go down branch #3 → go down this extension → go down branch #8 → you have arrived at your destination: a leaf_". Hashes, on the other hand, act as unique identifiers for each node and are generated in a way that allows the verification of data.

So, how is are hashes calculated in Ethereum?

1. First, all values from the node are serialized using the [Recursive Length Prefix encoding function](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp).
2. Then, a hash function (keccak256) is applied to the serialized data. This outputs a 32-bytes hash.

### 3a. Generating a hash

We saw in our example above that our extension node was referenced to by its hash. In this example, we'll try to manually compute its hash from its value. First, we look at the extension node's hash and its value.

```jsx
const node1 = await trie.findPath(utf8ToBytes('testKey'))
console.log('Extension node hash: ', bytesToHex(node1.node._branches[3]))

const node2 = await trie.lookupNode(node1.node._branches[3])
console.log('Extension node: ', node2)

// RESULT
Extension node hash: 0x391d4830de00875746984c4fd3ef5a0cf7ca7b40f9c28acee2ba224984418f6b

Extension node: ExtensionNode {
  _nibbles: [ 0, 3, 0, 3, 0 ],
  _value: Uint8Array(32) [
    112, 179, 208,  32, 173, 133, 143, 214,
      0,  40, 164,  35, 233, 143,  29, 153,
    197,  55, 205, 185,  31,  39,  73,  22,
     64,   6, 111, 234, 199, 156,  47, 114
  ],
  _terminator: false
}
```

As we learned, we should first use the [Recursive Length Prefix encoding function](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp) on the node to serialize the values of the extension node. RLP-encoding the "raw" version (as an array of bytes) of our node gives us:

```jsx
console.log(bytesToHex(rlp.encode(node2.raw())))

// RESULT
0xe583103030a070b3d020ad858fd60028a423e98f1d99c537cdb91f27491640066feac79c2f72
```

A neatly serialized sequence of bytes! Our last step is simply to take the hash of this RLP output (and convert it to bytes):

```jsx
console.log('Our computed hash:       ', bytesToHex(keccak256(rlp.encode(node2.raw()))))
console.log('The extension node hash: ', bytesToHex(node1.node._branches[3]))

// RESULT
Our computed hash:        0x391d4830de00875746984c4fd3ef5a0cf7ca7b40f9c28acee2ba224984418f6b
The extension node hash:  0x391d4830de00875746984c4fd3ef5a0cf7ca7b40f9c28acee2ba224984418f6b
```

Easy, wasn't it?

### 3b. Verification using a hash

Merkle trees allow us to verify the integrity of their data contained without requiring us to download the full tree. To demonstrate this we will re-use the example above. As we saw, we had an extension node that pointed to a branch node:

```jsx
console.log('Extension node: ', node2)

const node3 = await trie.lookupNode(node2._value)
console.log(node3)

// RESULT

Extension node: ExtensionNode {
  _nibbles: [ 0, 3, 0, 3, 0 ],
  _value: Uint8Array(32) [
    112, 179, 208,  32, 173, 133, 143, 214,
      0,  40, 164,  35, 233, 143,  29, 153,
    197,  55, 205, 185,  31,  39,  73,  22,
     64,   6, 111, 234, 199, 156,  47, 114
  ],
  _terminator: false
}

BranchNode {
  _branches: [
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  [
    Uint8Array(1) [ 49 ],
    Uint8Array(10) [
      116, 101, 115, 116,
       86,  97, 108, 117,
      101,  49
    ]
  ],
  [
    Uint8Array(1) [ 49 ],
    Uint8Array(10) [
      116, 101, 115, 116,
       86,  97, 108, 117,
      101,  65
    ]
  ],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) [],
  Uint8Array(0) []
],
  _value: Uint8Array(0) []
}

```

Now let's suppose that I'm provided with various pieces of information, some that I trust, and some that I don't. Here's what I know from a trustworthy source:

- The tree contains key-value pair "testKey": "testValue"
- There also exists a branch node with the following hash (the hash of the branch node corresponds to the \_value field of the extension node above [\_value: Uint8Array(32) [ 112, 179, 208, ... ]]. I've converted it to hex here for ease of reading): `0x70b3d020ad858fd60028a423e98f1d99c537cdb91f27491640066feac79c2f72`.
- The path corresponding to this branch node is "testKey000".
- This branch node contains at least one valid branch. This branch is located at index 4, with value [ `path: 0x31 | value: 0x7465737456616c756541` ] (equivalent to key-value pair "testKey0001": "testValue1")

Now, I'm getting conflicting information from two other shady sources:

- Marie claims that: _That branch node contains another branch, representing key-value pair "testKey000A": "testValueA"_
- John claims that: _That branch node contains another branch, representing key-value pairs "testKey000z": "testValuez"._

How can I determine who's telling the truth? Simple: by computing the branch node hash for each possibility, and comparing them with our trusted branch node hash!

```jsx
  await trie1.put(utf8ToBytes('testKey'), utf8ToBytes('testValue'))
  await trie1.put(utf8ToBytes('testKey0001'), utf8ToBytes('testValue1'))
  await trie1.put(utf8ToBytes('testKey000A'), utf8ToBytes('testValueA'))

  await trie2.put(utf8ToBytes('testKey'), utf8ToBytes('testValue'))
  await trie2.put(utf8ToBytes('testKey0001'), utf8ToBytes('testValue1'))
  await trie2.put(utf8ToBytes('testKey000z'), utf8ToBytes('testValuez'))

  const temp1 = await trie1.findPath(utf8ToBytes('testKey'))
  const temp2 = await trie2.findPath(utf8ToBytes('testKey'))

  const node1 = await trie1.lookupNode(temp1.node._branches[3])
  const node2 = await trie2.lookupNode(temp2.node._branches[3])

  console.log('Branch node 1 hash: ', bytesToHex(node1._value))
  console.log('Branch node 2 hash: ', bytesToHex(node2._value))

// Result
Branch node 1 hash: 0x70b3d020ad858fd60028a423e98f1d99c537cdb91f27491640066feac79c2f72
Branch node 2 hash: 0x722acc1b7361091c9a5e33154be4ac9ed8a8b93372069b0953da409da15a20c9
```

Using our already trusted information, we can be confident that Marie (node 1) is telling the truth, since the hash computed from her information is valid.

Note that we also could have compared the root hashes of the trees and compared them to a trusted tree root. This is possible because each distinct tree will produce a distinct hash!

```jsx
console.log(trie1.root())
console.log(trie2.root())

Root of trie 1:  0x467a64dde5de0a370a35750342a52d801f0b9b22590310b41d0bab7d3de0a35e
Root of trie 2:  0x38b0a5741af361141e7a29b6f29dab22757b7d647390f6e355e52e2beac1e304
```

Ethereum takes advantage of the uniqueness of each hash to efficiently secure the network. Without Merkle Trees, each Ethereum client would need to store the full history of the blockchain to verify any piece of information, and doing so would be extremely inefficient. With Merkle Trees, clients can verify that a transaction is valid given that they're provided with the minimal information required to re-compute the trusted root hash.

## 4. Merkle Patricia Trees in Ethereum

So, how does that tie in with Ethereum? Well, there are four Merkle Patricia Trees in Ethereum:

- The Global State Tree
- The Transactions Tree
- The Receipts Tree
- The Storage Tree

In this tutorial, we'll look at the transactions tree. We'll even interact with the real Ethereum blockchain!

### Configuring additional tools

To interact with the Ethereum blockchain, we will set up an API access to the Ethereum blockchain using a free service called [Infura](https://infura.io/).

If you want to follow along with these examples, you will need to create a free Infura account using this link: [https://infura.io/register](https://infura.io/register). Once you have created your account, create a new project in Infura, and copy the first URL under "Endpoints / Mainnet" (something like https://mainnet.infura.io/v3/YOUR_KEY). Then, replace the string `YOUR_INFURA_MAINNET_ENDPOINT` in `./examples/infura-endpoint.js` with your full copied Infura URL. You should be good to go! If not, refer to [this tutorial](https://coderrocketfuel.com/article/configure-infura-with-web3-js-and-node-js).

### The Transactions Tree

The purpose of the transactions tree is to record transaction requests. It can answer questions like: "What is the value of this transaction?" or "Who sent this transaction?". In the Ethereum blockchain, each block has its own transactions tree. Just like in our previous examples, we need a path to "navigate" the tree and access a particular transaction. In the transactions tree, this path is given by the Recursive Layer Protocol encoding of the transaction's index in the block. So, for example, if a transaction's index is 127:

```jsx
const rlp = require('@ethereumjs/rlp')
console.log('RLP encoding of 127: ', bytesToHex(rlp.encode('127')))

// RESULT
RLP encoding of '127':  0x83313237
```

We would, therefore, follow the path `8 → 3 → 3 → 1 → 3 → 2 → 3 → 7` and reach our destination.

So, what does our destination look like? It's a **key-value pair** (remember not to confuse this key with the path!) where:

- **The key** is the hash of the value. This is the "key" that we use when uniquely referencing a node (not to be confused with the "path" that we used to navigate to that key-value pair in the first place).
- **The value** is the Recursive Layer Protocol encoding of the node itself (which, if the transaction exists, will most likely be a leaf node). Remember that the leaf node is a 2-item array: `[ remainingPath, leafValue ]`. In the context of a transaction, "leafValue" will contain information relevant to our transaction (like its value, and who sent it).

A lot of confusion can arise from the fact that various distinct things are labelled "keys" and "values". It's important to understand how these items are nested within each other. The examples should help you understand this better.

### 4a. Retrieving a Transaction from the Ethereum Blockchain

Let's look at an individual transaction on the Ethereum blockchain. I've chosen a recent transaction from Vitalik that you can look up here: [https://etherscan.io/tx/0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074](https://etherscan.io/tx/0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074). We can retrieve the transaction information with a eth_getTransactionByHash JSON-RPC API call. The [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) is a standardized way of interacting with an Ethereum node:

```jsx
// Example 4a - Retrieving a Transaction from the Ethereum Blockchain

const INFURA_ENDPOINT = require('./infura_endpoint')
const https = require('https')

// Looking up an individual transaction
function lookupTransaction(transactionHash) {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getTransactionByHash',
    params: [transactionHash],
    id: 1,
  })

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  }

  const req = https.request(INFURA_ENDPOINT, options, (res) => {
    let responseData = ''

    res.on('data', (chunk) => {
      responseData += chunk
    })

    res.on('end', () => {
      console.log('Transaction:', JSON.parse(responseData))
    })
  })

  req.write(data)
  req.end()
}

lookupTransaction('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')

// RESULT
Transaction: {
  jsonrpc: '2.0',
  id: 1,
  result: {
    blockHash: '0x5ed2752bb54dc705a8b71f49566ccc4d5aaee1224a83c7938d9545db98dd0beb',
    blockNumber: '0x939ec7',
    chainId: '0x1',
    from: '0xf8db1ee1be12b28aa12477fc66b296dccfa66609',
    gas: '0x5208',
    gasPrice: '0x1dcd65000',
    hash: '0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074',
    input: '0x',
    nonce: '0x18',
    r: '0xe15616dfdf4a2af23f84322387f374db8c3c28656860e28ef66fea8a16980167',
    s: '0x75efdb2c06664e7a28c49e14ef0797ea964eac07c3e0f72e03e955068a93e79d',
    to: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
    transactionIndex: '0xad',
    type: '0x0',
    v: '0x26',
    value: '0x38d7ea4c68000'
  }
}
```

### 4b. Generating a Transaction Hash from Transaction Data

The previous transaction output contains all the information from the transaction node (plus additional information automatically provided by web3, like the blockHash and the blockNumber). As per [Ethereum's yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf), we know that a standard transaction is an array containing the following items (in hex): `[nonce, gasPrice, gasLimit, to, value, input, v, r, s]`. We should therefore extract this data from our previous transaction output to re-create a valid Ethereum transaction:

```jsx
function recomputeTransactionHash(transactionHash) {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getTransactionByHash',
    params: [transactionHash],
    id: 1,
  })

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  }

  const req = https.request(INFURA_ENDPOINT, options, (res) => {
    let responseData = ''

    res.on('data', (chunk) => {
      responseData += chunk
    })

    res.on('end', () => {
      const transaction = JSON.parse(responseData).result
      const transactionData = [
        transaction.nonce,
        transaction.gasPrice,
        transaction.gas,
        transaction.to,
        transaction.value,
        transaction.input,
        transaction.v,
        transaction.r,
        transaction.s,
      ]
      console.log('Transaction data: ', transactionData)
      console.log('Transaction hash: ', bytesToHex(keccak256(rlp.encode(transactionData))))
    })
  })

  req.write(data)
  req.end()
}

recomputeTransactionHash('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')


// RESULT
Transaction data:  [
  '0x18',
  '0x1dcd65000',
  '0x5208',
  '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
  '0x38d7ea4c68000',
  '0x',
  '0x26',
  '0xe15616dfdf4a2af23f84322387f374db8c3c28656860e28ef66fea8a16980167',
  '0x75efdb2c06664e7a28c49e14ef0797ea964eac07c3e0f72e03e955068a93e79d'
]
Transaction hash:  0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074
```

We're only one step away from generating the hash:

```jsx
console.log('Transaction hash: ', bytesToHex(keccak256(rlp.encode(transactionData))))

// RESULT
Transaction hash: 0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074
```

Awesome! This is the transaction hash we started with!

## Conclusion

This ends our exploration of Merkle Patricia Trees in Ethereum. If you'd like to learn more, I recommend the following resources:

- For more details on how the Merkle Patricia Trees work in Ethereum: https://medium.com/shyft-network-media/understanding-trie-databases-in-ethereum-9f03d2c3325d
- To explore how Merkle Patricia Trees are programmed: https://medium.com/coinmonks/implementing-merkle-tree-and-patricia-trie-b8badd6d9591

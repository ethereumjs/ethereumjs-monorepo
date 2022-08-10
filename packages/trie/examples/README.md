# Ethereum's Merkle Patricia Trees - An Interactive JavaScript Tutorial

Merkle Patricia Trees are the fundamental data structure on which Ethereum is built. In this tutorial, we will explore the inner workings of Ethereum's Merkle Patricia Trees, using follow-along examples written in JavaScript. This tutorial uses the [trie package](../) from the EthereumJS monorepo.

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

const trie = new Trie() // We create an empty Merkle Patricia Tree
console.log('Empty trie root (Bytes): ', trie.root) // The trie root (32 bytes)
```

and then store and retrieve a single key-value pair within it:

```jsx
async function test() {
  await trie.put('testKey', 'testValue') // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const value = await trie.get('testKey') // We retrieve (using "get") the value at key "testKey"
  console.log('Value (Bytes): ', value)
  console.log('Value (String): ', value.toString())
  console.log('Updated trie root:', trie.root) // The new trie root (32 bytes)
}

test()

// RESULT
Empty trie root (Bytes):  <Buffer 56 e8 1f 17 1b cc 55 a6 ff 83 45 e6 92 c0 f8 6e 5b 48 e0 1b 99 6c ad c0 01 62 2f b5 e3 63 b4 21>
Value (Bytes):  <Buffer 74 65 73 74 56 61 6c 75 65>
Value (String):  testValue
Updated trie root: <Buffer 8e 81 43 67 21 33 dd 5a b0 0d fc 4b 01 14 60 ea 2a 7b 00 d9 10 dc 42 78 94 2a e9 10 5c b6 20 74>
```

Quite simple. As expected, we can retrieve our value using the key. We can also note that the root hash of the tree has automatically been updated. We'll explore what tree roots stand for later; for now, simply know that each distinct tree will have a distinct root (we can therefore quickly verify if two trees are identical by comparing their roots!).

However, the example above does not reflect exactly how key-value pairs are stored and retrieved in Ethereum's Merkle Patricia Trees. Here are some things to keep in mind:

- Keys and values are stored and retrieved as raw bytes. As an example, the "BaseTrie" library automatically converted our "testKey" to bytes (`<74 65 73 74 4b 65 79>`).
- Values undergo an additional transformation before they are stored. They are encoded using the [Recursive Length Prefix encoding function](https://github.com/ethereum/wiki/wiki/RLP). This allows the serialization of strings and arrays. The "BaseTrie" library also does that automatically.
- Last but not least: in Ethereum, the keys also undergo another transformation: they are converted using a hash function (keccak256). The BaseTrie library **does not** do this.

### Example 1b - Manually Creating and Updating a Secure Trie

Let's retry the example above while respecting the rules we just mentioned. We will therefore:

- Use the keccak256 hash of the key instead of the key itself (using the "@ethereumjs/util" library).
- As a good practice, we'll also convert our keys and values to Bytes (using "Buffer.from(\_string)").

Here's what this looks like:

```jsx
const { Trie } = require('@ethereumjs/trie')
const { keccak256 } = require('@ethereumjs/util')

const trie = new Trie() // We create an empty Merkle Patricia Tree
console.log('Empty trie root (Bytes): ', trie.root) // The trie root (32 bytes)

async function test() {
  await trie.put(keccak256(Buffer.from('testKey')), Buffer.from('testValue')) // We update (using "put") the trie with the key-value pair hash("testKey"): "testValue"
  const value = await trie.get(keccak256(Buffer.from('testKey'))) // We retrieve (using "get") the value at hash("testKey"_
  console.log('Value (Bytes): ', value)
  console.log('Value (String): ', value.toString())
  console.log('Updated trie root:', trie.root) // The new trie root (32 bytes)
}

test()

// RESULT
Empty trie root (Bytes):  <Buffer 56 e8 1f 17 1b cc 55 a6 ff 83 45 e6 92 c0 f8 6e 5b 48 e0 1b 99 6c ad c0 01 62 2f b5 e3 63 b4 21>
Value (Bytes):  <Buffer 74 65 73 74 56 61 6c 75 65>
Value (String):  testValue
Updated trie root: <Buffer be ad e9 13 ab 37 dc a0 dc a2 e4 29 24 b9 18 c2 a1 ca c4 57 83 3b d8 2b 9e 32 45 de cb 87 d0 fb>
```

Nothing spectacular: only the root hash of the tree has changed, as the key has changed from "testKey" to keccak256("testKey").

### Example 1c - Automatically Creating and Updating a Secure Trie

Fortunately, we also have a library called "SecureTrie" that automatically takes care of the keccak256 hashing for us. We can see that it outputs the same root hash as example1b.js

```jsx
const { SecureTrie } = require('@ethereumjs/trie')// We import the library required to create a secure Merkle Patricia Tree

const trie = new SecureTrie() // We create an empty Merkle Patricia Tree
console.log('Empty trie root (Bytes): ', trie.root) // The trie root (32 bytes)

async function test() {
  await trie.put(Buffer.from('testKey'), Buffer.from('testValue')) // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const value = await trie.get(Buffer.from('testKey')) // We retrieve (using "get") the value at key "testKey"
  console.log('Value (Bytes): ', value)
  console.log('Value (String): ', value.toString())
  console.log('Updated trie root:', trie.root) // The new trie root (32 bytes)
}

test()

// RESULT
Empty trie root (Bytes):  <Buffer 56 e8 1f 17 1b cc 55 a6 ff 83 45 e6 92 c0 f8 6e 5b 48 e0 1b 99 6c ad c0 01 62 2f b5 e3 63 b4 21>
Value (Bytes):  <Buffer 74 65 73 74 56 61 6c 75 65>
Value (String):  testValue
Updated trie root: <Buffer be ad e9 13 ab 37 dc a0 dc a2 e4 29 24 b9 18 c2 a1 ca c4 57 83 3b d8 2b 9e 32 45 de cb 87 d0 fb> // Same hash!
```

To make the examples easier to follow, we won't be using the keccak256 of the keys (or the SecureTrie library) in this tutorial. However, keep in mind that inside Ethereum, keys are always encoded.

### Example 1d - Deleting a Key-Value Pair from a Trie

In addition to retrieving (using the method `get`) and adding (using the method `put`) key-value pairs to our tree, we can delete key-value pairs (using the method `del`).

```jsx
async function test() {
  await trie.put('testKey', 'testValue') // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const value = await trie.get('testKey') // We retrieve (using "get") the value at key "testKey"
  console.log('Value (String): ', value.toString()) // We retrieve our value
  console.log('Updated trie root:', trie.root) // The new trie root

  await trie.del('testKey')
  value = await trie.get('testKey') // We try to retrieve the value at (deleted) key "testKey"
  console.log('Value at key "testKey": ', value) // Key not found. Value is therefore null.

  console.log('Trie root after deletion:', trie.root) // Our trie root is back to its initial value
}

test()

// RESULT
Empty trie root:  <Buffer 56 e8 1f 17 1b cc 55 a6 ff 83 45 e6 92 c0 f8 6e 5b 48 e0 1b 99 6c ad c0 01 62 2f b5 e3 63 b4 21>
Value (String):  testValue
Updated trie root: <Buffer 8e 81 43 67 21 33 dd 5a b0 0d fc 4b 01 14 60 ea 2a 7b 00 d9 10 dc 42 78 94 2a e9 10 5c b6 20 74>
Value at key "testKey":  null
Trie root after deletion: <Buffer 56 e8 1f 17 1b cc 55 a6 ff 83 45 e6 92 c0 f8 6e 5b 48 e0 1b 99 6c ad c0 01 62 2f b5 e3 63 b4 21>
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
  const node1 = await trie.findPath(Buffer.from('testKey')) // We attempt to retrieve the node using the key "testKey"
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
console.log(Buffer.from('testKey'))
console.log(Buffer.from('testKey0'))
console.log(Buffer.from('testKeyA'))

// RESULT (BYTES)
<Buffer 74 65 73 74 4b 65 79>
<Buffer 74 65 73 74 4b 65 79 30>
<Buffer 74 65 73 74 4b 65 79 41>
```

We can see that the bytes representations of our keys branch off at byte `<79>`. This makes sense: `<79>` stands for the letter `y`. Let's now add those keys to our trie.

```jsx
// Add a key-value pair to the trie for each key
await trie.put(Buffer.from('testKey'), Buffer.from('testValue'))
await trie.put(Buffer.from('testKey0'), Buffer.from('testValue0'))
await trie.put(Buffer.from('testKeyA'), Buffer.from('testValueA'))

const node1 = await trie.findPath(Buffer.from('testKey')) // We retrieve the node at the "branching" off of the keys
console.log('Node: ', node1.node) // A branch node!

// RESULTS
Node:  BranchNode {
  _branches: [
    <Buffer >,
    <Buffer >,
    <Buffer >,
    [ <Buffer 30>, <Buffer 74 65 73 74 56 61 6c 75 65 30> ],
    [ <Buffer 31>, <Buffer 74 65 73 74 56 61 6c 75 65 41> ],
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >
  ],
  _value: <Buffer 74 65 73 74 56 61 6c 75 65>
}
```

And indeed, the node at path "testKey" is a branch, containing 16 branches and a value. Let's first look at the value located at the branch itself.

```jsx
console.log('Node value: ', node1.node._value.toString()) // The branch node's value

// RESULT
Node value:  testValue
```

Note that it's possible for a branch node to not have a value itself, but only branches. This would simply mean that the keys (i.e. the paths) branch off at a certain point, but that there is no end-value assigned at that specific point. See for example:

```jsx
await trie.put(Buffer.from('testKey0'), Buffer.from('testValue0'))
await trie.put(Buffer.from('testKeyA'), Buffer.from('testValueA'))

const node1 = await trie.findPath(Buffer.from('testKey')) // We retrieve the node at the "branching" off of the keys
console.log('Node: ', node1.node) // A branch node!

console.log('Node value: ', node1.node._value) // The branch node's value, in this case an empty buffer since the key "testValue" isn't assigned a value

// RESULT
Node:  BranchNode {
  _branches: [
    <Buffer >,
    <Buffer >,
    <Buffer >,
    [ <Buffer 30>, <Buffer 74 65 73 74 56 61 6c 75 65 30> ],
    [ <Buffer 31>, <Buffer 74 65 73 74 56 61 6c 75 65 41> ],
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >
  ],
  _value: <Buffer >
}
Node value:  <Buffer >
```

In this example, there is no value assigned to the key (path) "testKey" (an empty `<Buffer >`). However, the node at "testKey" is still a branch node, containing two branches (one leading to "testValue0", the other leading to "testValueA").

Let's take a closer look at the branches of our branch node.

```jsx
console.log('Node branches: ', node1.node._branches)

// RESULT
Node branches:  [
  <Buffer >,
  <Buffer >,
  <Buffer >,
  [ <Buffer 30>, <Buffer 74 65 73 74 56 61 6c 75 65 30> ],
  [ <Buffer 31>, <Buffer 74 65 73 74 56 61 6c 75 65 41> ],
  <Buffer >,
  <Buffer >,
  <Buffer >,
  <Buffer >,
  <Buffer >,
  <Buffer >,
  <Buffer >,
  <Buffer >,
  <Buffer >,
  <Buffer >,
  <Buffer >
]
```

14/16 of its branches are empty (`<Buffer >`). Only the branches at indexes `3` and `4` contain values. Now here's an important point. These indexes are not determined at random: **they correspond to the next hex-value of the path of our two keys (hex values `3` and `4`)**. This makes sense, as this is the value at which our keys diverge:

```jsx
//      <------ same ------> <-> (different)
<Buffer 74 65 73 74 4b 65 79 30>           // "testKey0", "0" = 30 in bytes
<Buffer 74 65 73 74 4b 65 79 41>           // "testKeyA", "A" = 41 in bytes
```

Going back to the branches above, we see that our two branches (at index `3` and `4`) are:

```jsx
// <--path-->  <------------- value ----------------->
[ <Buffer 30>, <Buffer 74 65 73 74 56 61 6c 75 65 30> ] // going down the path of "testKey0"
[ <Buffer 31>, <Buffer 74 65 73 74 56 61 6c 75 65 41> ] // going down the path of "testKeyA"
```

I'm getting ahead of myself here, but here's a spoiler: these are leaf nodes. We see that each line contains two "buffers" (buffers are sequences of bytes). And indeed: leaf nodes are arrays containing two items. The first item is the remaining path (we'll get back to what the hex values stand for in a minute), while the second buffer is the value at that path. We can confirm that the values are what we'd expect:

```jsx
console.log('Value of branch at index 3: ', node1.node._branches[3][1].toString())
console.log('Value of branch at index 4: ', node1.node._branches[4][1].toString())

// RESULT
Value of branch at index 3:  testValue0
Value of branch at index 4:  testValueA
```

Now here's a question for you:

**What type of node do you think exists at path "testKe"?** After all, this is also a common path, the first part of our 3 keys. Let's try it:

```jsx
const node2 = await trie.findPath(Buffer.from('testKe')) // We retrieve the node at "testKe"
console.log('Node 2: ', node2.node)

// RESULT
Node 2:  null
```

A null node! Did you expect a branch node?

This reveals a **key difference between standard ("Radix") tries and Patricia tries**. In standards tries, each step of the "path" would be a branch itself (i.e. branch node at `<7>`, `<74>`, `<74 6>`, `<74 65>`, and so on). However, creating a branch node for every step of the path is inefficient when there is only one valid "branch" for many of those steps. This is inefficient because each branch is a 17-item array, so using them to store only one non-null value is wasteful. Patricia tries avoid these unnecessary `branch` nodes by creating `extension` nodes at the beginning of the common path to act as "shortcuts". This explains why there is no branch node at key "testKe": it's bypassed by an extension node that begins higher-up (i.e. earlier in the path) in the trie.

### The Encoded Path in Leaf and Extension Nodes

We saw in one of our previous examples that the individual branches were in fact pointing to leaf nodes:

```jsx
// <--path-->  <------------- value ----------------->
[ <Buffer 30>, <Buffer 74 65 73 74 56 61 6c 75 65 30> ] // leaf node down the path of "testKey0"
[ <Buffer 31>, <Buffer 74 65 73 74 56 61 6c 75 65 41> ] // leaf node down the path of "testKeyA"
```

As we said above, leaf nodes are arrays that contain two items: `[ remainingPath, value ]`. We can see in the code above that the "remainingPath" of our first leaf node is `<30>`, while the second is `<31>`. What does this mean?

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

In our code above, the first hexadecimal characters for the encodedPath of both nodes (`<30>` and `<31>`) was `3`. This correctly indicates that the node is of type `leaf` and that the path that follows is of odd length. The second character ( `<0>` and `<1>` respectively) indicates the last part of the path (the last hex character of our key).

```jsx
//      <------ same ------> <-> (different)
<Buffer 74 65 73 74 4b 65 79 30>           // "testKey0", note that "0" = 30 in bytes
<Buffer 74 65 73 74 4b 65 79 41>           // "testKeyA", note that "A" = 41 in bytes
```

But what happened with the second to last hex character (`3` and `4` respectively)? Recall that these are not necessary: **they were already provided by the indexes of the previous branch node!**

With this in mind, let's take a closer look at leaf and extension nodes.

### Example 2c - Looking up a Leaf Node

In the last example, we inferred that the two branches of our branch node (at key/path "testKey") pointed to leaf nodes. We can confirm this by looking one of them up directly

```jsx
const node1 = await trie.findPath(Buffer.from('testKey0')) // We retrieve one of the leaf nodes
console.log('Node 1: ', node1.node) // A leaf node! We can see that it contains 2 items: the encodedPath and the value
console.log('Node 1 value: ', node1.node._value.toString()) // The leaf node's value

// RESULT
Node 1:  LeafNode {
  _nibbles: [ 0 ],
  _value: <Buffer 74 65 73 74 56 61 6c 75 65 30>
}
Node 1 value:  testValue0
```

Indeed! A leaf node with value "testValue0". The "nibble" indicates the last hex character(s) that differentiate this leaf from the parent branch. Since our branch node was "testKey" (in bytes = `<74 65 73 74 56 61 6c 75 65>`) , and since we took the branch corresponding to hex value `3`, we only need the last `0` to complete our full key/path of "testKey0" (in bytes = `<74 65 73 74 56 61 6c 75 65 30>`).

### Example 2d - Creating and Looking Up an Extension Node

To create an extension node, we need to slightly change our keys. We'll keep our branch node at path "testKey", but we'll change the two other keys so that they lead down a lengthy common path.

```jsx
console.log(Buffer.from('testKey'))
console.log(Buffer.from('testKey0001'))
console.log(Buffer.from('testKey000A'))

// RESULT
<Buffer 74 65 73 74 4b 65 79>
<Buffer 74 65 73 74 4b 65 79 30 30 30 31>
<Buffer 74 65 73 74 4b 65 79 30 30 30 41>
```

As you can see, the bytes `<30 30 30>` (standing for `000`> are common to both keys. We therefore should assume an extension that begins at index `3` of the branch node at "testKey". Let's see:

```jsx
await trie.put(Buffer.from('testKey'), Buffer.from('testValue'))
await trie.put(Buffer.from('testKey0001'), Buffer.from('testValue0'))
await trie.put(Buffer.from('testKey000A'), Buffer.from('testValueA'))

const node1 = await trie.findPath(Buffer.from('testKey')) // Looking up our branch node
console.log(node1.node) // The branch node

// RESULT

BranchNode {
  _branches: [
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer 39 1d 48 30 de 00 87 57 46 98 4c 4f d3 ef 5a 0c f7 ca 7b 40 f9 c2 8a ce e2 ba 22 49 84 41 8f 6b>,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >
  ],
  _value: <Buffer 74 65 73 74 56 61 6c 75 65>
}
```

As we should expect, there is a branch at index `3`. The branch contains a hash that we can use to lookup the child node:

```jsx
 const node2 = await trie.lookupNode(Buffer.from(node1.node._branches[3])) // Looking up the child node from its hash (using lookupNode)
 console.log(node2) // An extension node!

// RESULT
ExtensionNode {
  _nibbles: [ 0, 3, 0, 3, 0 ],
  _value: <Buffer 70 b3 d0 20 ad 85 8f d6 00 28 a4 23 e9 8f 1d 99 c5 37 cd b9 1f 27 49 16 40 06 6f ea c7 9c 2f 72>
}
```

Awesome! An extension node!

You might have noticed that this child node is a "hash", while in the previous examples, it was the leaf node itself. This is simply because of the way nodes are stored in branch nodes. If the [Recursive Length Prefix](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp) (RLP) encoding of the child node is less than 32 bytes, the node is stored directly. However, if the RLP encoding is equal to or longer than 32 bytes, a hash of the node is stored in the branch node, which can be used to lookup the child node directly.

Similarly to leaf nodes, extension nodes are two-item arrays: `[ encodedPath, hash ]` . The encodedPath (denoted above as "\_nibbles") stands for the "remaining path". In the case of extension nodes this is the path that we "shortcut". Recall our two keys:

```jsx
console.log(Buffer.from('testKey0001'))
console.log(Buffer.from('testKey000A'))

// RESULT
<Buffer 74 65 73 74 4b 65 79 30 30 30 31>
<Buffer 74 65 73 74 4b 65 79 30 30 30 41>
```

The first part of the path ("testKey" = `<74 65 73 74 4b 65 79>`) led us to the branch node. Next, taking the branch at index `3` (for hex value `<3>`) led us to our extension node, which automatically leads us down the path `[ 0, 3, 0, 3, 0 ]`. Using only two nodes (branch + extension), we are therefore able to "shortcut" the whole `<30 30 30>` part of the path! With a standard trie, this would have required 6 successive branch nodes!

Again, the value of the extension node leads us down to another node... can you guess what it will be?

```jsx
const node3 = await trie.lookupNode(Buffer.from(node2._value))
  console.log(node3)

// RESULT
BranchNode {
  _branches: [
    <Buffer >,
    <Buffer >,
    <Buffer >,
    [ <Buffer 31>, <Buffer 74 65 73 74 56 61 6c 75 65 31> ],
    [ <Buffer 31>, <Buffer 74 65 73 74 56 61 6c 75 65 41> ],
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >
  ],
  _value: <Buffer >
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
const node1 = await trie.findPath(Buffer.from('testKey'))
console.log('Extension node hash: ', node1.node._branches[3])

const node2 = await trie.lookupNode(Buffer.from(node1.node._branches[3]))
console.log('Value of extension node: ', node2)

// RESULT
Extension node hash:  <Buffer 39 1d 48 30 de 00 87 57 46 98 4c 4f d3 ef 5a 0c f7 ca 7b 40 f9 c2 8a ce e2 ba 22 49 84 41 8f 6b>

Value of extension node:  ExtensionNode {
  _nibbles: [ 0, 3, 0, 3, 0 ],
  _value: <Buffer 70 b3 d0 20 ad 85 8f d6 00 28 a4 23 e9 8f 1d 99 c5 37 cd b9 1f 27 49 16 40 06 6f ea c7 9c 2f 72>
}
```

As we learned, we should first use the [Recursive Length Prefix encoding function](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp) on the node to serialize the values of the extension node. RLP-encoding the "raw" version (as an array of bytes) of our node gives us:

```jsx

console.log(rlp.encode(node2.raw()))

// RESULT
<Buffer e5 83 10 30 30 a0 70 b3 d0 20 ad 85 8f d6 00 28 a4 23 e9 8f 1d 99 c5 37 cd b9 1f 27 49 16 40 06 6f ea c7 9c 2f 72>
```

A neatly serialized sequence of bytes! Our last step is simply to take the hash of this RLP output:

```jsx
console.log('Our computed hash:       ', keccak256(rlp.encode(node2.raw())))
console.log('The extension node hash: ', node1.node._branches[3])

// RESULT
Our computed hash:        <Buffer 39 1d 48 30 de 00 87 57 46 98 4c 4f d3 ef 5a 0c f7 ca 7b 40 f9 c2 8a ce e2 ba 22 49 84 41 8f 6b>
The extension node hash:  <Buffer 39 1d 48 30 de 00 87 57 46 98 4c 4f d3 ef 5a 0c f7 ca 7b 40 f9 c2 8a ce e2 ba 22 49 84 41 8f 6b>
```

Easy, wasn't it?

### 3b. Verification using a hash

Merkle trees allow us to verify the integrity of their data contained without requiring us to download the full tree. To demonstrate this we will re-use the example above. As we saw, we had an extension node that pointed to a branch node:

```jsx
console.log('Value of extension node: ', node2)

const node3 = await trie.lookupNode(Buffer.from(node2._value))
  console.log(node3)

// RESULT

Value of extension node:  ExtensionNode {
  _nibbles: [ 0, 3, 0, 3, 0 ],
  _value: <Buffer 70 b3 d0 20 ad 85 8f d6 00 28 a4 23 e9 8f 1d 99 c5 37 cd b9 1f 27 49 16 40 06 6f ea c7 9c 2f 72>
}

BranchNode {
  _branches: [
    <Buffer >,
    <Buffer >,
    <Buffer >,
    [ <Buffer 31>, <Buffer 74 65 73 74 56 61 6c 75 65 31> ],
    [ <Buffer 31>, <Buffer 74 65 73 74 56 61 6c 75 65 41> ],
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >,
    <Buffer >
  ],
  _value: <Buffer >
}

```

Now let's suppose that I'm provided with various pieces of information, some that I trust, and some that I don't. Here's what I know from a trustworthy source:

- The tree contains key-value pair "testKey": "testValue"
- There also exists a branch node with hash: `<Buffer 70 b3 d0 20 ad 85 8f d6 00 28 a4 23 e9 8f 1d 99 c5 37 cd b9 1f 27 49 16 40 06 6f ea c7 9c 2f 72>`.
- The path corresponding to this branch node is "testKey000".
- This branch node contains at least one valid branch. This branch is located at index 4, with value [ `<Buffer 31>`, `<Buffer 74 65 73 74 56 61 6c 75 65 31>` ] (equivalent to key-value pair "testKey0001": "testValue1")

Now, I'm getting conflicting information from two other shady sources:

- Marie claims that: _That branch node contains another branch, representing key-value pair "testKey000A": "testValueA"_
- John claims that: _That branch node contains another branch, representing key-value pairs "testKey000z": "testValuez"._

How can I determine who's telling the truth? Simple: by computing the branch node hash for each possibility, and comparing them with our trusted branch node hash!

```jsx
await trie1.put(Buffer.from('testKey'), Buffer.from('testValue'))
await trie1.put(Buffer.from('testKey0001'), Buffer.from('testValue1'))
await trie1.put(Buffer.from('testKey000A'), Buffer.from('testValueA')) // What Marie claims

await trie2.put(Buffer.from('testKey'), Buffer.from('testValue'))
await trie2.put(Buffer.from('testKey0001'), Buffer.from('testValue1'))
await trie2.put(Buffer.from('testKey000z'), Buffer.from('testValuez')) // What John claims

const temp1 = await trie1.findPath(Buffer.from('testKey'))
const temp2 = await trie2.findPath(Buffer.from('testKey'))

const node1 = await trie1.lookupNode(Buffer.from(temp1.node._branches[3]))
const node2 = await trie2.lookupNode(Buffer.from(temp2.node._branches[3]))

console.log('Branch node 1 hash: ', node1._value)
console.log('Branch node 2 hash: ', node2._value)

// Result
Branch node 1 hash:  <Buffer 70 b3 d0 20 ad 85 8f d6 00 28 a4 23 e9 8f 1d 99 c5 37 cd b9 1f 27 49 16 40 06 6f ea c7 9c 2f 72>
Branch node 2 hash:  <Buffer 72 2a cc 1b 73 61 09 1c 9a 5e 33 15 4b e4 ac 9e d8 a8 b9 33 72 06 9b 09 53 da 40 9d a1 5a 20 c9>
```

Using our already trusted information, we can be confident that Marie (node 1) is telling the truth, since the hash computed from her information is valid.

Note that we also could have compared the root hashes of the trees and compared them to a trusted tree root. This is possible because each distinct tree will produce a distinct hash!

```jsx
root1 = trie1.root
root2 = trie2.root
console.log(root1)
console.log(root2)

<Buffer 46 7a 64 dd e5 de 0a 37 0a 35 75 03 42 a5 2d 80 1f 0b 9b 22 59 03 10 b4 1d 0b ab 7d 3d e0 a3 5e>
<Buffer 38 b0 a5 74 1a f3 61 14 1e 7a 29 b6 f2 9d ab 22 75 7b 7d 64 73 90 f6 e3 55 e5 2e 2b ea c1 e3 04>
```

Ethereum takes advantage of the uniqueness of each hash to efficiently secure the network. Without Merkle Trees, each Ethereum client would need to store the full history of the blockchain to verify transactions. With Merkle Trees, clients can verify that a transaction is valid given that they're provided with the minimal information required to re-compute the trusted root hash.

## 4. Merkle Patricia Trees in Ethereum

So, how does that tie in with Ethereum? Well, there are four Merkle Patricia Trees in Ethereum:

- The Global State Tree
- The Transactions Tree
- The Receipts Tree
- The Storage Tree

In this tutorial, we'll look at the transactions tree. We'll even interact with the real Ethereum blockchain!

### Configuring additional tools

To interact with the Ethereum blockchain, we will use a JavaScript library called `web3`. We will also set up an API access to the Ethereum blockchain using a free tool called [Infura](https://infura.io/).

If you want to follow along with these examples, you will need to create a free Infura account using this link: [https://infura.io/register](https://infura.io/register). Once you have created your account, create a new project in Infura, and copy the first URL under "Endpoints / Mainnet" (something like https://mainnet.infura.io/v3/YOUR_KEY). Then, replace the string `YOUR_INFURA_MAINNET_ENDPOINT` in `./examples/infura-endpoint.js` with your full copied Infura URL. You should be good to go! If not, refer to [this tutorial](https://coderrocketfuel.com/article/configure-infura-with-web3-js-and-node-js).

### The Transactions Tree

The purpose of the transactions tree is to record transaction requests. It can answer questions like: "What is the value of this transaction?" or "Who sent this transaction?". In the Ethereum blockchain, each block has its own transactions tree. Just like in our previous examples, we need a path to "navigate" the tree and access a particular transaction. In the transactions tree, this path is given by the Recursive Layer Protocol encoding of the transaction's index in the block. So, for example, if a transaction's index is 127:

```jsx
const rlp = require('@ethereumjs/rlp')
console.log('RLP encoding of 127: ', rlp.encode('127'))

// RESULT
RLP encoding of 127:  <Buffer 83 31 32 37>
```

We would, therefore, follow the path `8 → 3 → 3 → 1 → 3 → 2 → 3 → 7` and reach our destination.

So, what does our destination look like? It's a **key-value pair** (remember not to confuse this key with the path!) where:

- **The key** is the hash of the value. This is the "key" that we use when uniquely referencing a node (not to be confused with the "path" that we used to navigate to that key-value pair in the first place).
- **The value** is the Recursive Layer Protocol encoding of the node itself (which, if the transaction exists, will most likely be a leaf node). Remember that the leaf node is a 2-item array: `[ remainingPath, leafValue ]`. In the context of a transaction, "leafValue" will contain information relevant to our transaction (like its value, and who sent it).

A lot of confusion can arise from the fact that various distinct things are labelled "keys" and "values". It's important to understand how these items are nested within each other. The examples should help you understand this better.

### 4a. Retrieving a Transaction from the Ethereum Blockchain

Let's look at an individual transaction on the Ethereum blockchain. I've chosen a recent transaction from Vitalik that you can look up here: [https://etherscan.io/tx/0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074](https://etherscan.io/tx/0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074). We can retrieve the transaction information with a script:

```jsx
const INFURIA_ENDPOINT = require('./infura_endpoint')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(INFURIA_ENDPOINT))

// Looking up an individual transaction
async function checkTransaction(transactionHash) {
  let transaction = await web3.eth.getTransaction(transactionHash)
  console.log('Transaction: ', transaction)
}
checkTransaction('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')

// RESULT
Transaction:  {
  blockHash: '0x5ed2752bb54dc705a8b71f49566ccc4d5aaee1224a83c7938d9545db98dd0beb',
  blockNumber: 9674439,
  from: '0xF8db1eE1BE12b28Aa12477fC66B296dccfA66609',
  gas: 21000,
  gasPrice: '8000000000',
  hash: '0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074',
  input: '0x',
  nonce: 24,
  r: '0xe15616dfdf4a2af23f84322387f374db8c3c28656860e28ef66fea8a16980167',
  s: '0x75efdb2c06664e7a28c49e14ef0797ea964eac07c3e0f72e03e955068a93e79d',
  to: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  transactionIndex: 173,
  v: '0x26',
  value: '1000000000000000'
}
```

### 4b. Generating a Transaction Hash from Transaction Data

The previous transaction output contains all the information from the transaction node (plus additional information automatically provided by web3, like the blockHash and the blockNumber). As per [Ethereum's yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf), we know that a standard transaction is an array containing the following items (in hex): `[nonce, gasPrice, gasLimit, to, value, input, v, r, s]`. We should therefore extract this data from our previous transaction output to re-create a valid Ethereum transaction:

```jsx
async function createTransactionHash(transactionHash) {
  let transaction = await web3.eth.getTransaction(transactionHash)
  transactionNode = [
    web3.utils.toHex(transaction.nonce),
    web3.utils.toHex(transaction.gasPrice),
    web3.utils.toHex(transaction.gas),
    transaction.to,
    web3.utils.toHex(transaction.value),
    transaction.input,
    transaction.v,
    transaction.r,
    transaction.s,
  ]
  console.log('Transaction data: ', transactionNode)
}

createTransactionHash('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')

// RESULT
Transaction data:  [
  '0x18',
  '0x1dcd65000',
  '0x5208',
  '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  '0x38d7ea4c68000',
  '0x',
  '0x26',
  '0xe15616dfdf4a2af23f84322387f374db8c3c28656860e28ef66fea8a16980167',
  '0x75efdb2c06664e7a28c49e14ef0797ea964eac07c3e0f72e03e955068a93e79d'
]
```

We're only one step away from generating the hash:

```jsx
console.log('Transaction hash: ', keccak256(rlp.encode(transactionNode)))

// RESULT
Transaction hash:  <Buffer 2f 81 c5 9f b4 f0 c3 14 64 83 e7 2c 13 15 83 3a f7 9b 6e a9 32 3b 64 71 01 64 5d c7 eb e0 40 74>
```

Awesome! This is the transaction hash we started with!

## Conclusion

This ends our exploration of Merkle Patricia Trees in Ethereum. If you'd like to learn more, I recommend the following resources:

- For more details on how the Merkle Patricia Trees work in Ethereum: https://medium.com/shyft-network-media/understanding-trie-databases-in-ethereum-9f03d2c3325d
- To explore how Merkle Patricia Trees are programmed: https://medium.com/coinmonks/implementing-merkle-tree-and-patricia-trie-b8badd6d9591

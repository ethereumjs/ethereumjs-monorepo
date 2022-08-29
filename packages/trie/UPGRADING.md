# Upgrading

## Disclaimer

Due to the high number of breaking changes, upgrading is typically a tedious process. Having said this, we aim to document as many breaking changes and edge cases as possible, and this is precisely what the following guide covers. Note that we actively encourage and accept PRs should you wish to contribute to and improve this guide.

## From v4 to v5

### API, Name and Visibility Changes

We have instituted several changes to the public API of this package in order to provide an improved DX and simplify the process of maintaining it.

The 5.0.0 release comes with a variety of new options, some of which replace old behaviours or classes.

### Single Trie Class

There is now one single `Trie` class which contains and exposes the functionality previously split into the three separate classes `Trie` -> `CheckpointTrie` and `SecureTrie`. Class inheritance has been removed and the existing functionality has been integrated into one class. This should make it easier to extend the Trie class or customize its behavior without having to "dock" into the previous complicated inheritance structure.

#### Default Checkpointing Behavior

The `CheckpointTrie` class has been removed in favor of integrating the functionality into the main `Trie` class and make it a default behaviour. Every Trie instance now comes complete with checkpointing behaviour out of the box, without giving any additional weight or performance penalty if the functionality remains unused.

#### Secure Trie with an Option

The `SecureTrie` class has been removed as well. Instead there is a new constructor option `useKeyHashing` - defaulting to `false`. This effectively reduces the level of inheritance dependencies (for example, in the old structure, you could not create a secure trie without the checkpoint functionality which, in terms of logic, do not correlate in any way). This also provides more room to accommodate future design modifications and/or additions if required.

Updating is a straightforward process:

```ts
// Old
const trie = new SecureTrie()

// New
const trie = new Trie({ useKeyHashing: true })
```

### Removed Getter and Setter Functions

Due to the ambiguity of the `get` and `set` functions (also known as getters and setters), usage has been removed from the library. This is because their ambiguity can create the impression of interacting with a property on a trie instance.

#### Trie `root` Getter/Setter

For this reason, a single `root(hash?: Buffer): Buffer` function serves as a replacement for the previous `root` getter and setter and can effectively work to get and set properties. This makes it obvious that you intend to modify an internal property of the trie that is neither accessible or mutable via any other means other than this particular function.

##### Getter Example

```tsx
// Old
const trie = new Trie()
trie.root

// New
const trie = new Trie()
trie.root()
```

##### Setter Example

```tsx
// Old
const trie = new Trie()
trie.root = Buffer.alloc(32)

// New
const trie = new Trie()
trie.root(Buffer.alloc(32))
```

#### Trie `isCheckpoint` Getter

The `isCheckpoint` getter function has been removed. The `hasCheckpoints()` function serves as its replacement and offers the same behaviour.

```tsx
// Old
const trie = new Trie()
trie.isCheckpoint

// New
const trie = new Trie()
trie.hasCheckpoints()
```

### Root Persistence

In previous iterations, you would need to persist and restore the root of your trie and determine how to achieve this of your own accord. This behaviour is now available out of the box. You can enable persistence by setting the `useRootPersistence` option to `true` when constructing a trie by using the `Trie.create` function. As such, this value is preserved when creating copies of the trie. Moreover, upon instantiating a trie, you will not have the ability to modify said value.

```ts
import { Trie, LevelDB } from '@ethereumjs/trie'
import { Level } from 'level'

const trie = await Trie.create({
  db: new LevelDB(new Level('MY_TRIE_DB_LOCATION')),
  useRootPersistence: true,
})
```

The `Trie.create` function is asynchronous and will read the root from your database before returning the trie instance. If you do not require automatic restoration of the root, you can simply use the `new Trie` constructor with the same options and achieve persistence without automatic restoration.

### Database Abstraction

Another significant change is that we dropped support for `LevelDB` out of the box. As a result, you will need to have your own implementation available.

#### Motivation

The primary reason for this change is increase the flexibility of this package by allowing developers to select any type of storage for their unique purposes. In addition, this change renders the project far less susceptible to [supply chain attacks](https://en.wikipedia.org/wiki/Supply_chain_attack). We trust that users and developers can appreciate the value of reducing this attack surface in exchange for a little more time spent on their part for the duration of this upgrade.

#### LevelDB Removal

Prior to v5, this package shipped with a LevelDB integration out of the box. With this latest version, we have introduced a database abstraction and therefore no longer ship with the aforementioned LevelDB implementation. However, for your convenience, we provide all of the necessary steps so that you can integrate it accordingly.

##### Installation

Before proceeding with the implementation of `LevelDB`, you will need to install several important dependencies.

```shell
npm i @ethereumjs/trie @ethereumjs/util abstract-level level memory-level --save-exact
```

Note that the `--save-exact` flag will pin these dependencies to exact versions prior to installing them. We recommend carrying out this action in order to safeguard yourself against the aforementioned risk of supply chain attacks.

##### Implementation

Fortunately the implementation does not require any input from you other than copying and pasting the below code into a file of your choosing in any given location. You will then import this to any area in which you need to instantiate a trie.

```ts
import { isTruthy } from '@ethereumjs/util'
import { MemoryLevel } from 'memory-level'

import type { BatchDBOp, DB } from '@ethereumjs/trie'
import type { AbstractLevel } from 'abstract-level'

const ENCODING_OPTS = { keyEncoding: 'buffer', valueEncoding: 'buffer' }

export class LevelDB implements DB {
  readonly _leveldb: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>

  constructor(
    leveldb?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer> | null
  ) {
    this._leveldb = leveldb ?? new MemoryLevel(ENCODING_OPTS)
  }

  async get(key: Buffer): Promise<Buffer | null> {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error: any) {
      if (isTruthy(error.notFound)) {
        // not found, returning null
      } else {
        throw error
      }
    }
    return value as Buffer
  }

  async put(key: Buffer, val: Buffer): Promise<void> {
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  async del(key: Buffer): Promise<void> {
    await this._leveldb.del(key, ENCODING_OPTS)
  }

  async batch(opStack: BatchDBOp[]): Promise<void> {
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }

  copy(): DB {
    return new LevelDB(this._leveldb)
  }
}
```

Now we can create an instance of the `Trie` class such as the following:

```ts
import { Trie } from '@ethereumjs/trie'
import { Level } from 'level'

import { LevelDB } from './your-level-implementation'

const trie = new Trie({ db: new LevelDB(new Level('MY_TRIE_DB_LOCATION')) })
```

##### Alternatives

If you wish to use any other database implementations, you can read and review [our recipes](./recipes) which offer various implementations of different database engines.

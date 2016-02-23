# ethereumjs-wallet

A lightweight wallet implementation. At the moment it supports key creation and conversion between various formats.

It is complemented by the following packages:
- [ethereumjs-tx](https://github.com/ethereumjs/ethereumjs-tx) to sign transactions
- [ethereumjs-icap](https://github.com/ethereumjs/ethereumjs-icap) to manipulate ICAP addresses
- [store.js](https://github.com/marcuswestin/store.js) to use browser storage

Motivations are:
- be lightweight
- work in a browser
- use a single, maintained version of crypto library
- support import/export between various wallet formats

Features not supported:
- signing transactions
- managing storage (neither in node.js or the browser)

## API

Constructors:

* `fromPrivateKey` - create an instance based on a raw key
* `fromV1` - import a wallet (Version 1 of the Ethereum wallet format)
* `fromV3` - import a wallet (Version 3 of the Ethereum wallet format)
* `fromEthSale` - import an Ethereum Pre Sale wallet

Instance methods:

* `getPrivateKey` - return the private key
* `getPublicKey` - return the public key
* `getAddress` - return the address
* `toV3` - return the wallet as a JSON string (Version 3 of the Ethereum wallet format)

All of the above instance methods return a Buffer or JSON. Use the `String` suffixed versions for a string output, such as `getPrivateKeyString`.

# Building for the browser

One of the goals of our libraries is to be fully browser compatible. We have examples using the [`vite`](https://vitejs.dev/) framework in each of the libraries that can be referenced as a jumping off point.

## Projects that use EthereumJS libraries in the browser

Here are some projects that use our libraries in browser to give you some inspiration. These are not guaranteed to be 100% up to date but give you some examples of projects that use our code.

- [TEVM](https://github.com/evmts/tevm-monorepo) - a JavaScript EVM client and a Solidity-to-TypeScript compiler
- [Remix](https://remix.ethereum.org/) - a browser based Soldity compiler
- [Blobs4Every1](https://github.com/acolytec3/blobs4every1) - a simple Vite + React web app that can generate Blob EIP 4844 Transactions and submit them to the Holesky chain

## Potential Gotchas

Some of our libraries use Javascript APIs where the NodeJS and browser versions are not 100% equivalent. In these cases, these APIs need to be polyfilled when building for the browser. Below are known potential browser incompatibilities and polyfills that are known to work in browser. Please refer to your particular bundler/framework on guidance for how to leverage these polyfills in your application.

- `events` - [`eventemitter3`](https://www.npmjs.com/package/eventemitter3) - Our usage of the native NodeJS `eventemitter` class apparently onflicts with the typing of the browser equivalent `eventemitter` and polyfilling with `eventemitter3` is known to resolve this
- `node:stream/web` - [`web-streams-polyfill`](https://www.npmjs.com/package/web-streams-polyfill) - The `trie` library uses a `ReadableStream` that requires this polyfill to work in browser

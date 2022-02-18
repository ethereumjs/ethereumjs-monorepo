# Quick Start

## To compile Rust to Wasm

For ESM
- run `wasm-pack build`. You should see a `pkg` folder appear.

For a NodeJS module
- run `wasm-pack build --target nodejs`.  


## To call Rust from Javascript as WASM

For an ESM example, use below
- cd into `js_code`
- run `npm install`. You should see a `node_modules` folder appear.
- run `node -r esm stateless_update.js` you should see a Uint8Array in the console.

For NodeJS + Typescript, import in any `.ts` file as below:
`import wasm from 'path/to/rust-verkle-wasm/pkg/rust_verkle_wasm'`

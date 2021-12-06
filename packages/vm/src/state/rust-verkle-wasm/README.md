# Quick Start

## To compile Rust to Wasm

- run `wasm-pack build`. You should see a `pkg` folder appear.

## To call Rust from Javascript as WASM

- cd into `js_code`
- run `npm install`. You should see a `node_modules` folder appear.
- run `node -r esm index.js` you should see a Uint8Array in the console.
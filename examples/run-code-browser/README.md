# Build

Build the project from the console:

```shell
npm run build:dist
```

This will create a new folder `dist/`.

# Run Example in Node

```shell
node index.js
```

# Run Example in a Browser

## Prerequisites

```shell
$ npm install -g browserify http-server
```

## Instruction

Run command

```shell
$ browserify index.js -o bundle.js
```

Then host this folder in a web server

```shell
$ http-server
```

open http://localhost:8080 in a browser and check the result in web console.

# EthereumJS - Monorepo Setup

## Development quick start

First, make sure you have the `ethereum-tests` git submodule, by running: 

```sh
git submodule init
git submodule update
```

This monorepo uses [Lerna](https://lerna.js.org/). It links the local packages together, making development a lot easier.

TLDR: Setup
```sh
npm install
npm run build
```

TLDR: To update dependencies and (re-)link packages
```sh
npm run bootstrap
npm run build
```

Above is the quickest way to set you up. Going down the road, there are two sets of commands: *project* and *package-specific* commands. You can find them at `./package.json` and `./packages/*/package.json`, respectively. Here's a breakdown:

### Project scripts — run from repository root

#### `npm install`
Adds dependencies listed in the root package. Also, it executes the `bootstrap` script described below, installing all sub-packages dependencies.

#### `npm run bootstrap`

Installs dependencies for all sub-packages, and links them to create an integrated development environment.

#### `npm run build`

Builds all monorepo packages by default. If a scope is provided, it will only build that particular package.

Scoped example, that will only build the VM package: 
  npm run build -- --scope @ethereumjs/vm


#### `npm run build:tree -- --scope @ethereumjs/blockchain`

Builds all local packages that the provided package depends on (e.g.: @ethereumjs/blockchain), and builds itself. 

If no scope is provided, `npm run build:tree`, will build all sub-packages.

#### `npm run clean`

Removes root and packages `node_modules` directories, and other generated files, like `coverage`, `dist` and others. This is useful to run after changing branches, to have a clean slate to work with.

#### `npm run lint` and `npm run lint:fix`

These scripts execute `lint` and `lint:fix` respectively, to all monorepo packages. Worth noting that there is a git hook in place that runs `npm run lint` for every `git push`. This check can be skipped using `git push [command] --no-verify`.

### Package scripts — run from `./packages/<name>`

 **⚠️ Important: if you run `npm install` from the package directory, it will remove all links to the local packages, pulling all dependencies from npm. Run `npm install` from the root only.**
 
There's a set of rather standardized commands you will find in each package of this repository.

#### `npm run build`

Uses TypeScript compiler to build source files. The resulting files can be found at `packages/<name>/dist`.

#### `npm run coverage`

Runs whatever is on `npm run test` script, capturing testing coverage information. By the end, it displays a coverage table. Additional reports can be found at `packages/<name>/coverage/`.

#### `npm run docs:build`

Generates package documentation and saves them to `./packages/<name>/docs`.

#### `npm run lint`

Checks code style according to the rules defined in [ethereumjs-config](https://github.com/ethereumjs/ethereumjs-config).

#### `npm run lint:fix`

Fixes code style according to the rules. Differently from `npm run lint`, this command actually writes to files.

#### `npm run test`

Runs the package tests. 

_Note that the VM has several test scopes - refer to [packages/vm/package.json](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/package.json) for more info._

### Going further

As this project is powered by Lerna, you can install it globally to enjoy lots more options. Refer to [Lerna docs](https://github.com/lerna/lerna/tree/master/commands/run) for additional commands.

- `npm install -g lerna`
- `lerna run`
- `lerna exec`

#### Cleaning `node_modules`

Hoisting is enabled so dependencies are moved to the root `node_modules`. `lerna clean` [does not remove the root `node_modules`](https://github.com/lerna/lerna/issues/1304) so for convenience you can use the project script `npm run clean`.

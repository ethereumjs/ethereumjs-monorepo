# EthereumJS - Monorepo Setup

## Development quick start

First, make sure you have the `ethereum-tests` git submodule, by running:

```sh
git submodule init
git submodule update
```

This monorepo uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces). It links the local packages together, making development a lot easier.

TLDR: Setup

```sh
npm i
```

TLDR: To update dependencies

```sh
npm run build --workspaces
```

Above is the quickest way to set you up.

### ℹ️ Note for Windows users:

Windows users might run into the following error when trying to install the repo: `'.' is not recognized as an internal or external command`. To remediate for this, you can force Windows to use Git bash to run scripts (you'll need to install [Git for Windows](https://git-scm.com/download/win) for this) with the following command:

```sh
npm config set script-shell "C:\\Program Files (x86)\\git\\bin\\bash.exe"
```

If you ever need to reset this change, you can do so with this command:

```sh
npm config delete script-shell
```

---

Going down the road, there are two sets of commands: _project_ and _package-specific_ commands. You can find them at `./package.json` and `./packages/*/package.json`, respectively. Here's a breakdown:

### Project scripts — run from repository root

#### `npm install` (alias: `npm i`)

Adds dependencies listed in the root package.

#### `npm run build --workspaces`

Builds all monorepo packages.

To build a specific package, use `npm run build --workspace=@ethereumjs/vm`

#### `npm run clean`

Removes root and packages `node_modules` directories, and other generated files, like `coverage`, `dist` and others. This is useful to run after changing branches, to have a clean slate to work with.

#### `npm run lint --workspaces` and `npm run lint:fix --workspaces`

These scripts execute `lint` and `lint:fix` respectively, to all monorepo packages. Worth noting that there is a git hook in place that runs `npm run lint` for every `git push`. This check can be skipped using `git push [command] --no-verify`.

#### `npm run docs:build --workspaces`

Rebuilds all generated docs.

### Package scripts — run from `./packages/<name>`

**⚠️ Important: if you run `npm install` from the package directory, it will [ignore the workspace](https://github.com/npm/cli/issues/2546). Run `npm install` from the root only.**

There's a set of rather standardized commands you will find in each package of this repository.

#### `npm run build`

Uses TypeScript compiler to build source files. The resulting files can be found at `packages/<name>/dist`.

#### `npm run coverage`

Runs whatever is on `npm run test` script, capturing testing coverage information. By the end, it displays a coverage table. Additional reports can be found at `packages/<name>/coverage/`.

#### `npm run docs:build`

Generates package documentation and saves them to `./packages/<name>/docs`.

#### `npm run lint`

Checks code style according to the eslint rules.

#### `npm run lint:fix`

Fixes code style according to the rules. Differently from `npm run lint`, this command actually writes to files.

#### `npm run test`

Runs the package tests.

_Note that the VM has several test scopes - refer to [packages/vm/package.json](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/package.json) for more info._

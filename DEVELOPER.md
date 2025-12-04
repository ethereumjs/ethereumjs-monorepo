# EthereumJS - Developer Docs

This guide provides an overview of the monorepo, development tools used, shared configuration and additionally covers some advanced topics.

It is intended to be both an entrypoint for external contributors as well as a reference point for team members.

## Contents

- [Monorepo](#monorepo)
  - [Structure](#structure)
  - [Workflow](#workflow)
  - [Releases](#releases)
- [Development Tools](#development-tools)
  - [TypeScript](#typescript)
  - [Linting](#linting)
  - [Spellcheck](#spellcheck)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [Advanced Topics](#advanced-topics)
  - [Linking to an External Library](#linking-to-an-external-library)
  - [Shared Dependencies](#shared-dependencies)
- [Additional Docs](#additional-docs)
  - [VM](#vm)
  - [Client](#client)

## Monorepo

### Structure

The EthereumJS project uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage all the packages in our monorepo and link packages together.

#### Key Directories

- `/packages` - Contains all EthereumJS packages
- `/config` - Shared configuration files and scripts
- `packages/ethereum-tests` - Git submodule with Ethereum test vectors (legacy)
- `packages/execution-spec-tests-fixtures` - Git submodule with selected Ethereum test vectors

### Scripts

The `./config/cli` directory contains helper scripts referenced in package.json files:

- `coverage.sh` - Runs test coverage
- `ts-build.sh` - Builds TypeScript for production
- `ts-compile.sh` - Compiles TypeScript for development

### Workflow

#### Common Commands

- **Clean the workspace**: `npm run clean` - Removes build artifacts and node_modules
- **Lint code**: `npm run lint` - Check code style with ESLint v9 and Biome
- **Fix linting issues**: `npm run lint:fix` - Automatically fix style issues
- **Build all packages**: `npm run build --workspaces` - Build all packages in the monorepo
- **Build documentation**: `npm run docs:build` - Generate documentation for all packages

#### Working on a Specific Package

To focus on a single package (e.g., VM):

1. Navigate to the package directory: `cd packages/vm`
2. Run tests: `npm run test`
3. Run a specific test: `npx vitest test/path/to/test.spec.ts`
4. Build just that package: `npm run build --workspace=@ethereumjs/vm`

### Releases

#### Overview

Releases are done in sync for all [active packages](./README.md#active-packages) and all libraries are always bumped to a same new version number. Library combinations with matching versions are CI tested and ensured to be compatible with each other.

Most release rounds are done as bugfix releases, including releases of non-finalized EIP versions. Minor releases are done for hardfork finalization and otherwise outstanding selected features. Major release rounds are rarely done and are reserved to bundle structural breaking changes which come along significant changes to the API.

#### Process

The following prompts have been tested with Cursor IDE to work well for release preparation:

Step 1: CHANGELOG entries, version bumps and dependency updates
(please adjust dates, versions and file references accordingly)

```markdown
We are planning to do a new release round for all active packages listed in @README.md on September 10 2025, bumping versions to 10.0.1.

Can you please add new headers in the relevant CHANGELOG.md files for the packages, e.g. @CHANGELOG.md?

Please then also bump the version number in the relevant package.json files like @package.json of the active packages.

And last but not least please update the internal dependency versions in `package.json` files accordingly, both if listed as dependencies as well as dev dependencies, and this step for both the active and the deprecated (also see @README.md) packages. Do not include the root package.json file here.
```

Step 2: Condensed CHANGELOG entries
(again, dates and commit hashes to be adjusted accordingly, examples can remain as provided)

```markdown
Thanks, that was great!

Last release round has been done on April 29 2025 along commit 9e461f54312bf20c710b43ab73f7d3ad753f8765.

We now would want to deal with the rather minor changes being done since then and include them in the new section fo the CHANGELOG.md files for the active repositories that you just prepared for.

As a first step can you go through all commits after the mentioned last release round and identify PRs (one commit is the same as one PR in our specific work setup) where active production code in the respective src directories has been touched. You can leave out PRs only updating documentation, code in the examples folder or tests. Also tooling infrastructure (linting,...) and CI updating PRs can be left out. New support for new and deprecation for older Node.js as well as TypeScript versions should be added. Version updates for external dependencies - so not from within the monorepo - should be added as well.

Can you now based on this collection add simple one-liner summaries in the CHANGELOG sections, one line for each PR respectively commit identified to be added. Here are a few examples for orientation regarding the desired format:

- New default hardfork: `Shanghai` -> `Cancun`, see PR [#3566](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3566)
- `Block.validateData()` now throws if unsigned txs are added, PR [#3240](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3240)
- Remove `networkId` property from chain files (use `chainId` instead), PR [#3513](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3513)
- Upgrade to TypeScript 5, PR [#3607](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3607)
- Stricter prefixed hex typing, PRs [#3348](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3348)
- Adds support for [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) EOA code transactions (outdated) (see tx library for full documentation), see PR [#3470](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3470)

Added lines should follow the format from the examples given above. PR numbers and links can be extracted from the commit titles, these are the hash-prefixed number links in the title.

For the CHANGELOG files you have not added lines in this step please enter the following sentence instead: Maintenance release, no active changes.
```

#### In-between Releases

We have a simple release script for lightweight in-between releases like nightly or non-official alpha releases. This is meant
for e.g. external targeted testing and releases are not mentioned in CHANGELOG.md files.

```sh
tsx scripts/simple-release.ts <version> <npm_token> <tag>
```

Example:

```sh
tsx scripts/simple-release.ts 10.1.1-nightly.1 abc123 nightly
```

#### Windows Users Note

Windows users might encounter errors with script paths. To fix, configure Git bash as the script shell:

```sh
npm config set script-shell "C:\\Program Files (x86)\\git\\bin\\bash.exe"
```

To reset this setting:

```sh
npm config delete script-shell
```

## Development Tools

### TypeScript

All packages use [TypeScript](https://www.typescriptlang.org/) with a shared base configuration.

#### Configuration Files

Each package should have:

- `tsconfig.json` - For development and testing
- `tsconfig.prod.json` - For building production releases

Example `tsconfig.json`:
```json
{
  "extends": "../../config/tsconfig.json",
  "include": ["src/**/*.ts", "test/**/*.ts"]
}
```

Example `tsconfig.prod.json`:
```json
{
  "extends": "../../config/tsconfig.prod.json",
  "include": ["src/**/*.ts"],
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

#### Build Commands

Use these commands in your package scripts:

```json
{
  "scripts": {
    "tsc": "../../config/cli/ts-compile.sh",
    "build": "../../config/cli/ts-build.sh"
  }
}
```

### Linting

We use [ESLint](https://eslint.org/) v9 and [Biome](https://biomejs.dev/) for code style enforcement and linting.

#### Configuration Files

Each package includes:

- `eslint.config.mjs` - package specific ESLint configuration that extends the repository wide config


#### Commands

Commands area available on both root and package levels.

Run `npm run lint` to find lint issues and `npm run lint:fix` to fix fixable lint issues.


### Spellcheck

We use [cspell](https://github.com/streetsidesoftware/cspell) to do spellchecking. 

#### Configuration Files

The following two configuration files include a list of allowed words (add yours if you have one necessary) as well as some additional configuration, separate for docs and code.

- `config/cspell-md.json` | `Markdown`
- `config/cspell-ts.json` | `TypeScript`

#### Commands

Commands area available on both root and package levels.

```json
{
  "scripts": {
    "sc": "npm run spellcheck",
    "spellcheck": "npm run spellcheck:ts && npm run spellcheck:md",
    "spellcheck:ts": "npx cspell --gitignore -c ../../config/cspell-ts.json ...",
    "spellcheck:md": "npx cspell --gitignore -c ../../config/cspell-md.json ..."
  }
}
```

### Testing

The project uses [Vitest](https://vitest.dev/) for testing with [c8](https://vitest.dev/guide/coverage.html) for code coverage.

#### General

Each package includes one or more test scripts.  To run all tests in any package, use `npm run test`.  Refer to the package.json for more specifics.

To run a specific test and watch for changes:

```sh
npx vitest test/path/to/test.spec.ts
```

#### Browser

We use `vitest` with [playwright](https://playwright.dev/) to run browser tests.  When running browser tests with `npm run test:browser`, ensure you have a version of the Chromium browser installed.  If not, you can run `npx playwright install --with-deps` to install a supported version.

## Advanced Topics

### Linking to an External Library

#### Quick Summary

To test packages with an external project locally, use npm link:

1. Build the package you want to test:
```sh
cd packages/package-name
npm run build
```

2. Link the package globally:
```sh
npm link
```

3. In your test project, link to the local package:
```sh
cd path/to/your/project
npm link @ethereumjs/package-name
```

4. When you make changes to your package, rebuild it for the changes to be reflected.

5. When done testing, unlink:
```sh
# In your test project
npm unlink --no-save @ethereumjs/package-name

# In the package directory
npm unlink
```

When making changes to the linked package, rebuild it for the changes to be reflected in your test project.

### Shared Dependencies

Common development dependencies (e.g. `eslint`, `biome`) are defined in the root `package.json`. 

## Additional Docs

There are selected additional developer docs available to get more deep on certain topics. The following is an overview.

### VM

[VM Docs](./packages/vm/DEVELOPER.md) for testing, debugging and VM/EVM profiling.

### Client

[Client Docs](./packages/client/DEVELOPER.md) for running Hive tests.
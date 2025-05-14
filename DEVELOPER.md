# EthereumJS - Developer Docs

This guide provides an overview of the monorepo, development tools used, shared configuration and additionally covers some advanced topics.

It is intended to be both an entrypoint for external contributors as well as a reference point for team members.

## Contents

- [Monorepo](#monorepo)
  - [Structure](#structure)
  - [Workflow](#workflow)
- [Development Tools](#development-tools)
  - [TypeScript](#typescript)
  - [Linting](#linting)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [Advanced Topics](#advanced-topics)
  - [E2E Testing](#e2e-testing)
  - [Cross-Package Development](#cross-package-development)
- [Additional Docs](#additional-docs)
  - [VM](#vm)
  - [Client](#client)

## Monorepo

### Structure

The EthereumJS project uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage all the packages in our monorepo and link packages together.

#### Key Directories

- `/packages` - Contains all EthereumJS packages
- `/config` - Shared configuration files and scripts
- `/ethereum-tests` - Git submodule with Ethereum test vectors

### Scripts

The `./config/cli` directory contains helper scripts referenced in package.json files:

- `coverage.sh` - Runs test coverage
- `lint.sh` - Checks code style
- `lint-fix.sh` - Automatically fixes code style issues
- `ts-build.sh` - Builds TypeScript for production
- `ts-compile.sh` - Compiles TypeScript for development

### Workflow

#### Common Commands

- **Clean the workspace**: `npm run clean` - Removes build artifacts and node_modules
- **Lint code**: `npm run lint --workspaces` - Check code style with ESLint v9 and Biome
- **Fix linting issues**: `npm run lint:fix --workspaces` - Automatically fix style issues
- **Build all packages**: `npm run build --workspaces` - Build all packages in the monorepo
- **Build documentation**: `npm run docs:build --workspaces` - Generate documentation for all packages

#### Working on a Specific Package

To focus on a single package (e.g., VM):

1. Navigate to the package directory: `cd packages/vm`
2. Run tests: `npm test`
3. Run a specific test: `npx vitest test/path/to/test.spec.ts`
4. Build just that package: `npm run build --workspace=@ethereumjs/vm`

#### Cross-Package Development

All packages include a `typescript` entry in the exports map that allows direct use of TypeScript sources without recompilation:

- Run tests with TypeScript sources: `npx vitest --config ../../config/vitest.config.mts test/myTest.spec.ts`
- Run TypeScript scripts: `tsx --conditions=typescript myScript.ts`
- Set environment variable for bash scripts: `NODE_OPTIONS='--conditions=typescript'`

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

All packages use TypeScript with a shared base configuration.

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

We use ESLint v9 and Biome for code style enforcement and linting.

#### Configuration Files

Each package includes:

- `eslint.config.mjs` - package specific ESLint configuration that extends the repository wide config


#### Lint Commands

```json
{
  "scripts": {
    "lint": "../../config/cli/lint.sh",
    "lint:fix": "../../config/cli/lint-fix.sh"
  }
}
```

### Testing

The project uses Vitest for testing with c8 for code coverage.

#### General

Each package includes one or more test scripts.  To run all tests in any package, use `npm run test`.  Refer to the package.json for more specifics.

To run a specific test and watch for changes:

```sh
npx vitest test/path/to/test.spec.ts
```

#### Browser

We use `vitest` with `playwright` to run browser tests.  When running browser tests with `npm run test:browser`, ensure you have a version of the Chromium browser installed.  If not, you can run `npx playwright install --with-deps` to install a supported version.

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

### Cross-Package Development

All packages include a `typescript` entry in their exports map to enable direct use of TypeScript sources without recompilation:

- For tests: `npx vitest --config ../../config/vitest.config.mts test/myTest.spec.ts`
- For scripts: `tsx --conditions=typescript myScript.ts`
- Via environment variable: `NODE_OPTIONS='--conditions=typescript'`

This feature makes it easier to develop across multiple packages simultaneously.

### Shared Dependencies

Common development dependencies (e.g. `eslint`, `biome`) are defined in the root `package.json`. 

## Additional Docs

There are selected additional developer docs available to get more deep on certain topics. The following is an overview.

### VM

[VM Docs](./packages/vm/DEVELOPER.md) for testing, debugging and VM/EVM profiling.

### Client

[Client Docs](./packages/client/DEVELOPER.md) for running Hive tests.
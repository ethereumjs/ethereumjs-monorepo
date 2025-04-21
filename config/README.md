# EthereumJS - Configuration Guide

This guide provides an overview of the configuration systems and development tools used throughout the EthereumJS monorepo. It consolidates information that was previously spread across multiple documents to provide a single reference point.

## Contents

- [Monorepo Structure](#monorepo-structure)
- [Development Tools](#development-tools)
  - [TypeScript](#typescript)
  - [Linting](#linting)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [Advanced Topics](#advanced-topics)
  - [E2E Testing](#e2e-testing)
  - [Cross-Package Development](#cross-package-development)

## Monorepo Structure

The EthereumJS project uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage all the packages in our monorepo.

### Key directories

- `/packages` - Contains all EthereumJS packages
- `/config` - Shared configuration files and scripts
- `/ethereum-tests` - Git submodule with Ethereum test vectors

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

#### Test Commands

Each package includes one or more test scripts.  To run all tests in any package, use `npm run test`.  Refer to the package.json for more specifics.

To run a specific test and watch for changes:

```sh
npx vitest test/path/to/test.spec.ts
```

## Advanced Topics

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

### Cross-Package Development

All packages include a `typescript` entry in their exports map to enable direct use of TypeScript sources without recompilation:

- For tests: `npx vitest --config ../../config/vitest.config.mts test/myTest.spec.ts`
- For scripts: `tsx --conditions=typescript myScript.ts`
- Via environment variable: `NODE_OPTIONS='--conditions=typescript'`

This feature makes it easier to develop across multiple packages simultaneously.

### Shared Dependencies

Common development dependencies (e.g. `eslint`, `biome`) are defined in the root `package.json`. 

## CLI Scripts

The `./config/cli` directory contains helper scripts referenced in package.json files:

- `coverage.sh` - Runs test coverage
- `lint.sh` - Checks code style
- `lint-fix.sh` - Automatically fixes code style issues
- `ts-build.sh` - Builds TypeScript for production
- `ts-compile.sh` - Compiles TypeScript for development

# EthereumJS - Monorepo and Shared Config

This folder contains documentation on monorepo setup and configuration as well as shared
configuration settings and scripts for common modules (like a shared `tsconfig.json` TypeScript
configuration file or `cli/coverage.sh` script).

- [Monorepo](./MONOREPO.md) (separate docs)
- [E2E Testing](./E2E_TESTING.md) (separate docs)
- [Linting](#linting)
- [Coverage](#coverage)
- [TypeScript](#typescript)
- [Documentation](#documentation)

The cli scripts (`./config/cli`) are used in the child packages' `package.json` to ease repetitive script use.

## Dependencies

Shared config `devDependencies` across all packages can go in the root `package.json`. However, if a package needs access to the dependency's `bin` (e.g. `eslint` or `nyc`) then it must be defined in the child packages' `package.json`.

## Linting

Common linting configuration utilizing:

- [ESLint](https://eslint.org/)
- [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint)
- [TypeStrict](https://github.com/krzkaczor/TypeStrict)
- [Prettier](https://prettier.io/docs/en/integrating-with-linters.html)

Exposed CLI commands:

- `./config/cli/lint.sh`
- `./config/cli/lint-fix.sh`

### Usage

Add `.eslintrc.js`:

```js
module.exports = {
  extends: '../../config/eslint.js',
}
```

In this file you can add rule adjustments or overrides for the specific package.

Add `prettier.config.js`:

```js
module.exports = require('../../config/prettier.config')
```

Use CLI commands above in your `package.json`:

```json
  "scripts": {
    "lint": "../../config/cli/lint.sh",
    "lint:fix": "../../config/cli/lint-fix.sh",
  }
```

### Getting the most out of linting

This lint package is used as git pre-push hook on with the help of [Husky](https://www.npmjs.com/package/husky).

## Coverage

Tool: [nyc](https://istanbul.js.org/)

Exposed CLI command:

- `./config/cli/coverage.sh`

### Usage

Add `.nycrc`:

```json
{
  "extends": "../../config/.c8rc.json"
}
```

Use script above in `package.json`:

```json
  "scripts": {
    "coverage": "../../config/cli/coverage.sh"
  }
```

## TypeScript

Tool: [TypeScript](https://www.typescriptlang.org/)

Exposed CLI commands:

- `./config/cli/ts-build.sh`
- `./config/cli/ts-compile.sh`

### Usage

The three files below compose the functionality built into `ts-build.sh` and `ts-compile.sh`. Note that the build is browser compatible with `ES2020` target.
Add `tsconfig.json`:

```json
{
  "extends": "../../config/tsconfig.json",
  "include": ["src/**/*.ts", "test/**/*.ts"]
}
```

Add `tsconfig.prod.json`:

```json
{
  "extends": "../../config/tsconfig.prod.json",
  "include": ["src/**/*.ts"],
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

Note: the `outDir` property is mandatory to generate assets to a directory.

Use CLI commands above in your `package.json`:

```json
  "scripts": {
    "tsc":   "../../config/cli/ts-compile.sh",
    "build": "../../config/cli/ts-build.sh"
  }
```

### Doing cross-package development

All of our packages include a `typescript` entry in the `exports` map under the `esm` key.  This allows `node`/`tsx`/`vitest` to use
the typescript sources directly without requiring you to recompile packages when you make changes.

Vitest is already configured to use the `typescript` entry points so simply specify `npx vitest run-c ../../config/vitest.config.mts test/myTest.spec.ts` 
when running individual tests.

If running typescript scripts from the command line, you can use `tsx --conditions=typescript myScript.ts` to use the typescript sources.

When running code using a bash script, you can set an environment variable `NODE_OPTIONS='--conditions=typescript'` and this will get picked by `tsx`.

## Documentation

Add `typedoc.js` to a package that extends the generic TypeDoc configuration:

```js
module.exports = {
  extends: '../../config/typedoc.js',
  // Additional directives
}
```

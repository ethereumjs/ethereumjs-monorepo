# @ethereumjs/testdata

This package contains common test data used across EthereumJS packages. It is intended to be used as a devDependency in other packages within the monorepo.

## Usage

To use this package in another package within the monorepo:

1. Add it as a devDependency in the package's `package.json`:
```json
{
  "devDependencies": {
    "@ethereumjs/testdata": "workspace:*"
  }
}
```

2. Import test data in your test files:
```typescript
import { testData } from '@ethereumjs/testdata'
```

## Development

This package is not published to npm and is meant to be used only within the EthereumJS monorepo.

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by the Ethereum Foundation JavaScript team, see our [website](https://ethereumjs.github.io/) for a team introduction. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

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

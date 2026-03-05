# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

EthereumJS monorepo containing TypeScript implementations of Ethereum execution layer protocol components. Managed as npm workspaces with packages in `/packages/`. All active packages are versioned in sync (currently v10.x).

## Commands

### Root-level (all packages)
```sh
npm install                          # Install and auto-builds all packages
npm run build --workspaces           # Build all packages
npm run lint                         # ESLint v9 + Biome check
npm run lint:fix                     # Auto-fix lint issues
npm run test                         # Run all package tests
npm run tsc                          # Type-check all packages
npm run spellcheck                   # cspell on TS and MD files
npm run clean                        # Remove build artifacts and node_modules
```

### Per-package (cd into package first, or use --workspace flag)
```sh
npm run build                        # Build (ESM + CJS via ts-build.sh)
npm run tsc                          # Type-check only (ts-compile.sh)
npm run test                         # Run package tests
npm run test:node                    # Node-only tests
npm run test:browser                 # Browser tests (requires Chromium)
npm run coverage                     # Coverage report
npm run lint                         # Lint this package
```

### Running a specific test file
```sh
npx vitest test/path/to/test.spec.ts
# Or from root:
npm run test --workspace=@ethereumjs/vm
```

### VM-specific testing (in `packages/vm`)
```sh
# API tests
npm run test:API

# State tests (ethereum/tests submodule)
npm run test:state                           # Default fork (Prague)
npm run test:state -- --fork=Cancun         # Specific fork
npm run test:state -- --test=stackOverflow  # Specific test case
npm run test:state -- --file=create2collisionCode2
npm run test:state -- --dir=stCreate2

# Blockchain tests
npm run test:blockchain
npm run test:blockchain -- --file=randomStatetest303
npm run test:blockchain -- --dir=bcBlockGasLimitTest
npm run test:blockchain -- --debug --test=ZeroValue_SELFDESTRUCT_ToOneStorageKey_OOGRevert_d0g0v0_EIP158

# Execution spec tests (newer runner for Prague+)
npm run test:est:stable:state
npm run test:est:stable:blockchain
npm run test:est:dev:state
npm run test:est:dev:blockchain
```

### Browser test dependencies
```sh
npx playwright install --with-deps   # Install Chromium for browser tests
```

## Architecture

### Package Dependency Graph (simplified)
```
rlp → util → common → tx, block, statemanager, evm, blockchain, vm
mpt → statemanager → evm → vm
binarytree → statemanager
block → blockchain → vm
genesis → statemanager, mpt
```

### Key Packages

**`@ethereumjs/common`** — The foundation. Manages chain configs, hardfork parameters, and EIP activation. Every other package consumes `Common`. Hardforks are tracked from `Chainstart` through `Prague`/`Osaka`/`Amsterdam`. The `Common` instance is passed through the entire stack to gate hardfork-specific behavior.

**`@ethereumjs/evm`** — The EVM execution engine. Core files:
- `evm.ts` — Main EVM class, handles call/create dispatch and precompile routing
- `interpreter.ts` — Opcode-by-opcode execution loop
- `opcodes/` — Opcode implementations (`functions.ts`, `gas.ts`, EIP-specific files)
- `precompiles/` — Numbered files matching precompile addresses (01–11 + bls12_381)
- `journal.ts` — State journaling for reverts
- `memory.ts`, `stack.ts` — EVM memory and stack
- `eof/` — EVM Object Format (EOF) support

**`@ethereumjs/vm`** — Block/transaction execution layer wrapping the EVM. Core files:
- `vm.ts` — VM class
- `runBlock.ts` — Block execution
- `runTx.ts` — Transaction execution
- `buildBlock.ts` — Block building helper

**`@ethereumjs/statemanager`** — Multiple state manager implementations:
- `MerkleStateManager` — MPT-based (standard)
- `StatefulBinaryTreeStateManager` — Verkle tree-based (Osaka+)
- `SimpleStateManager` — In-memory, no trie
- `RPCStateManager` — Backed by an RPC endpoint

**`@ethereumjs/common`** state flows: `Common` → hardfork/EIP checks throughout EVM/VM/StateManager.

### Build System

Each package builds dual ESM + CJS output to `dist/esm/` and `dist/cjs/` via shared shell scripts in `config/cli/`. TypeScript sources live in `src/` and tests in `test/`. The `exports` field in each `package.json` maps `typescript` condition to raw `src/index.ts` for development and `default` to compiled dist.

### Test Infrastructure

- **Framework**: Vitest with `typescript` resolve condition (runs source directly)
- **VM spec tests**: Two submodules — `packages/ethereum-tests` (legacy `ethereum/tests`, used for pre-Prague forks) and `packages/execution-spec-tests` (new runner for Prague+ via `executionSpecState.test.ts` / `executionSpecBlockchain.test.ts`)
- **Environment variables** for old VM test runner: `VITE_FORK`, `VITE_TEST`, `VITE_FILE`, `VITE_DIR`
- **Skip lists** in `packages/vm/test/tester/config.ts`: `SKIP_BROKEN`, `SKIP_PERMANENT`, `SKIP_SLOW`

### Code Style

- **Formatter**: Biome (2-space indent, 100-char line width, single quotes, no semicolons)
- **Linter**: ESLint v9 with TypeScript plugin
- All packages use `"type": "module"` (ESM-first)
- Imports use `.ts` extensions in source files

### Hardfork Support

Current hardfork sequence (from `@ethereumjs/common`):
`Chainstart → Homestead → ... → Berlin → London → Paris → Shanghai → Cancun → Prague → Osaka → Bpo1–Bpo5 → Amsterdam`

EIPs can be activated individually on top of a hardfork: e.g. `Common` with `eips: [3855, 3860]`.

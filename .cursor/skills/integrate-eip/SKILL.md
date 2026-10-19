---
name: integrate-eip
description: Checklist for adding or graduating an EIP on master or the new-eips branch after the modularity refactor (Common, registries, modules, tests).
---

# Integrate an EIP

Use on **`master`** (single EIP or small set) or **`new-eips`** (experimental batch). Structural refactors stay on `master`; the branch adds modules + registry lines.

## 1. Common

1. Add or update row in `packages/common/src/eips.ts` (`minimumHardfork`, `requiredEIPs`, optional `conflictsWith` / `supersedes`).
2. Add params to the relevant `params*.ts` (EVM, VM, tx, block).
3. If the fork bundle changes, update `packages/common/src/hardforks.ts` (on `new-eips` first; graduate with the fork).
4. Optional: `resolveEIPs([...])` for dependency-ordered activation in tests.

## 2. Per-package modules

| Package | Action |
| --- | --- |
| **evm** | Opcode → `opcodes/eips/eipNNNN.ts` + `OPCODE_EIP_MODULES`. Precompile → `precompiles/`. Concern spanning opcodes → strategy hook on `EVM` if needed. |
| **block** | Header field → row in `header/headerEipFields.ts`. |
| **tx** | New type → folder + `TX_TYPE_REGISTRY` + manual union in `types.ts`. |
| **vm** | Tx flow → `runTx/` step or `TX_EXECUTORS`. Block → `applyPreTransactionSystemOperations` or post-tx list. |
| **util** | Neutral types only (no EIP gates). |

## 3. Registry line

One append per registry (`OPCODE_EIP_MODULES`, `TX_TYPE_REGISTRY`, `HEADER_EIP_FIELD_ROWS`, `TX_EXECUTORS`, precompile table). Keep EIP numbers greppable.

## 4. Tests

- `packages/*/test/eips/eip-NNNN.spec.ts` or extend existing EIP specs.
- EST / legacy vectors: do not weaken fixtures.
- Combination test on `new-eips`: activate full branch EIP set once.

## 5. Finish gates

1. `npm run tsc` in touched packages (or `npm run tsc --workspaces`).
2. `npm run spellcheck`.
3. Package unit tests.
4. If exports changed: `node --import tsx/esm scripts/regenerate-public-api-snapshots.mjs`.
5. **`type: test performance`** only when this work can plausibly move a measured hot loop. A refactor, or a hot-path package touch, is not enough.

## 6. Graduate from `new-eips`

Cherry-pick or re-implement on `master`, merge PR, drop duplicate commits on next rebase.

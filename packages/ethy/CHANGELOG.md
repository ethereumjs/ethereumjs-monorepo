# Changelog

## Unreleased

### Added

- **WP-04j:** `@awasm/noble` keccak for snap range proof verification and `FlatStateManager` (`ethyKeccak256` with `@noble/hashes` fallback when WASM cannot load).
- Initial WP-01 foundation: `EthySpine`, four-zone TUI, deterministic `IntentEngine`, `--demo` synthetic sync.
- **WP-04c:** Single-pass binary snap ingest, batched binary account journals (`0xE34A0003`), multi-peer flight scheduling (`snapSchedulePolicy`, depth-2 pipelining), discovery hold hysteresis, `npm run sync:bench` manual scaling benchmark.

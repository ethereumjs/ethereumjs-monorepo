# Bundle Size Analysis

This document describes the bundle size analysis tooling for the EthereumJS monorepo.

## Overview

The bundle size analysis script (`scripts/analyze-bundle-size.js`) analyzes the compiled bundle sizes for all packages in the monorepo. It calculates both raw and gzipped sizes for ESM and CJS builds.

## Usage

### Basic Analysis

Analyze current bundle sizes:

```bash
npm run bundle:analyze
```

### Save Baseline

Save current bundle sizes as a baseline for comparison:

```bash
npm run bundle:save
# Or with custom output file:
node scripts/analyze-bundle-size.js --save --output=my-baseline.json
```

### Compare with Baseline

Compare current bundle sizes with a saved baseline:

```bash
npm run bundle:compare
# Or with custom baseline file:
node scripts/analyze-bundle-size.js --compare --baseline=my-baseline.json
```

## CI Integration

The bundle size analysis runs automatically in CI on:
- **Pull Requests**: Compares bundle sizes against the base branch (e.g., master)
- **Pushes to master**: Analyzes bundle sizes without comparison

The CI job:
- Runs as a non-blocking side task (`continue-on-error: true`)
- Shows comparison results highlighting significant changes (>5% or >10KB)
- Does not fail the workflow if bundle sizes increase

## Output Format

### Standard Analysis

```
📊 Bundle Size Analysis Results

Package             ESM Raw     ESM Gzip    CJS Raw     CJS Gzip    Total Raw   Total Gzip
genesis             723.09 KB   259.54 KB   723.68 KB   259.98 KB   1.41 MB     519.53 KB
...
```

### Comparison Mode

```
📊 Bundle Size Comparison (Current vs Baseline)

Package             Baseline Raw   Current Raw    Diff Raw            Baseline Gzip  Current Gzip   Diff Gzip
genesis             1.41 MB        1.42 MB        +10.5 KB (+0.7%)    519.53 KB      521.2 KB       +1.67 KB (+0.3%)
```

**Indicators:**
- ⚠️  Significant increase (>5% or >10KB)
- ✅ Significant decrease (>5% or >10KB)
- (no indicator) No significant change

## For Breaking Releases

As mentioned by the PM, for breaking releases you should:
1. Run bundle analysis before the release
2. Review the results to ensure bundle sizes are acceptable
3. Use the comparison feature to track changes from the previous release

## Manual Comparison Workflow

To manually compare your changes with master:

```bash
# 1. Checkout master and build
git checkout master
npm ci
npm run build --workspaces --if-present

# 2. Save baseline
npm run bundle:save -- --output=master-baseline.json

# 3. Checkout your branch and build
git checkout your-branch
npm run build --workspaces --if-present

# 4. Compare
npm run bundle:analyze -- --compare --baseline=master-baseline.json
```

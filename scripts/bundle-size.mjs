#!/usr/bin/env node
/**
 * Simple bundle size analysis script
 * Calculates minified+gzipped bundle sizes for each package and compares with baseline.
 */

import { readdir, stat, readFile, writeFile } from 'fs/promises'
import { gzipSync } from 'zlib'
import { join, relative, resolve } from 'path'
import { pathToFileURL } from 'url'
import { build } from 'esbuild'

const packagesDir = join(process.cwd(), 'packages')
/**
 * Safely parse JSON from disk
 */
async function readJson(filePath) {
  try {
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function resolveExportTarget(target) {
  if (!target) return null
  if (typeof target === 'string') return target
  if (typeof target !== 'object') return null
  if (target.import?.default) return target.import.default
  if (typeof target.import === 'string') return target.import
  if (target.default?.default) return target.default.default
  if (typeof target.default === 'string') return target.default
  return null
}

function resolveEntry(packageJson) {
  const exportsField = packageJson?.exports
  if (exportsField) {
    const rootExport = exportsField['.'] ?? exportsField
    const resolved = resolveExportTarget(rootExport)
    if (resolved) return resolved
  }
  return packageJson?.module ?? packageJson?.main ?? null
}

/**
 * Get internal workspace packages so we can bundle them.
 */
async function getInternalPackages() {
  const internal = new Map()
  const entries = await readdir(packagesDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const packageJsonPath = join(packagesDir, entry.name, 'package.json')
    const packageJson = await readJson(packageJsonPath)
    if (packageJson?.name) {
      internal.set(packageJson.name, join(packagesDir, entry.name))
    }
  }
  return internal
}

/**
 * Collect the union of every non-workspace dependency declared across all
 * workspace packages. These are treated as `external` for every bundle so that
 * external deps pulled in *transitively* through a workspace dependency are
 * excluded too — not just the entry package's direct deps. Without this, deps
 * such as `@noble/curves` or `lru-cache` get bundled (and duplicated across
 * each package's nested node_modules), inflating the reported sizes with code
 * that a consumer would install only once.
 */
async function getExternalDependencies(internalPackages) {
  const external = new Set()
  const entries = await readdir(packagesDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const packageJson = await readJson(join(packagesDir, entry.name, 'package.json'))
    if (!packageJson) continue
    const deps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.peerDependencies || {}),
      ...(packageJson.optionalDependencies || {}),
    }
    for (const dep of Object.keys(deps)) {
      if (!internalPackages.has(dep)) external.add(dep)
    }
  }
  return Array.from(external)
}

/**
 * Bundle and minify a package entry and return the gzipped size of its *entry
 * chunk* — the code a consumer eagerly loads when importing the package.
 *
 * Code splitting is enabled so that modules pulled in via dynamic `import()`
 * land in separate on-demand chunks instead of being inlined into the entry.
 * A consumer only pays for those chunks when the corresponding code path runs,
 * so they are excluded from the reported number (e.g. `@ethereumjs/genesis`
 * lazy-loads each chain's multi-hundred-KB allocation this way).
 */
async function getBundledSize(entryPath, pkgDir, external) {
  const result = await build({
    entryPoints: [entryPath],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'es2020',
    treeShaking: true,
    minify: true,
    sourcemap: false,
    write: false,
    splitting: true,
    // Required by esbuild when `splitting` is enabled; nothing is written to
    // disk because `write: false` keeps the output in memory.
    outdir: 'bundle-size-analysis',
    metafile: true,
    logLevel: 'silent',
    absWorkingDir: pkgDir,
    external,
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  })

  if (!result.outputFiles || result.outputFiles.length === 0) return 0

  // The entry chunk is the single output esbuild flags with an `entryPoint` in
  // the metafile; every other output is a shared or dynamically-imported chunk.
  const outputs = result.metafile?.outputs ?? {}
  const entryFile =
    result.outputFiles.find((file) => outputs[relative(pkgDir, file.path)]?.entryPoint) ??
    result.outputFiles[0]

  return gzipSync(Buffer.from(entryFile.text)).length
}

/**
 * Format bytes to KB
 */
function formatKB(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB'
}

/**
 * Analyze all packages
 */
async function analyzePackages() {
  try {
    const packages = await readdir(packagesDir, { withFileTypes: true })
    const internalPackages = await getInternalPackages()
    const external = await getExternalDependencies(internalPackages)
    const results = {}
    const errors = []

    for (const pkg of packages) {
      if (!pkg.isDirectory()) continue

      const pkgDir = join(packagesDir, pkg.name)
      const packageJson = await readJson(join(pkgDir, 'package.json'))
      if (!packageJson) continue

      const entryRel = resolveEntry(packageJson)
      if (!entryRel) continue

      const entryPath = resolve(pkgDir, entryRel)
      try {
        await stat(entryPath)
        const size = await getBundledSize(entryPath, pkgDir, external)
        if (size > 0) {
          results[pkg.name] = size
        }
      } catch (error) {
        errors.push(`${pkg.name}: ${error.message}`)
      }
    }

    if (errors.length > 0) {
      console.error('⚠️ Bundle size analysis errors:')
      for (const message of errors) {
        console.error(`- ${message}`)
      }
    }
    return results
  } catch (error) {
    return {}
  }
}

const UNCHANGED_PERCENT_EPS = 0.01

function classifyRow(currentSize, baselineSize) {
  if (baselineSize === 0 && currentSize === 0) return null
  if (baselineSize === 0) {
    return { kind: 'new', currentSize, baselineSize, diffBytes: currentSize, diffPercent: null }
  }
  if (currentSize === 0) {
    return { kind: 'removed', currentSize, baselineSize, diffBytes: -baselineSize, diffPercent: null }
  }
  const diffBytes = currentSize - baselineSize
  const diffPercent = (diffBytes / baselineSize) * 100
  if (Math.abs(diffPercent) < UNCHANGED_PERCENT_EPS) {
    return { kind: 'unchanged', currentSize, baselineSize, diffBytes, diffPercent }
  }
  return {
    kind: diffBytes > 0 ? 'up' : 'down',
    currentSize,
    baselineSize,
    diffBytes,
    diffPercent,
  }
}

function formatDiffCell(row) {
  if (row.kind === 'new') return '🆕 new package'
  if (row.kind === 'removed') return '🗑️ removed'
  if (row.kind === 'unchanged') return '±0%'
  const sign = row.diffBytes > 0 ? '+' : ''
  const emoji = row.diffBytes > 0 ? '🔴' : '🟢'
  return `${emoji} ${sign}${formatKB(row.diffBytes)} (${sign}${row.diffPercent.toFixed(2)}%)`
}

function markdownTable(headers, rows) {
  const sep = headers.map(() => '---')
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${sep.join(' | ')} |`,
    ...rows.map((cells) => `| ${cells.join(' | ')} |`),
  ]
  return lines.join('\n')
}

/**
 * Compare results and generate compact markdown for PR comments.
 */
function generateMarkdownReport(current, baseline) {
  const allPackages = Array.from(new Set([...Object.keys(current), ...Object.keys(baseline)])).sort()
  const rows = []

  for (const pkg of allPackages) {
    const currentSize = current[pkg] || 0
    const baselineSize = baseline[pkg] || 0
    const classified = classifyRow(currentSize, baselineSize)
    if (!classified) continue
    rows.push({
      package: pkg,
      size: formatKB(currentSize),
      diff: formatDiffCell(classified),
      sortKey: Math.abs(classified.diffPercent ?? 1000),
      ...classified,
    })
  }

  if (rows.length === 0) {
    return '## 📦 Bundle size\n\nNo packages found to compare.\n'
  }

  const changed = rows.filter((r) => r.kind !== 'unchanged')
  const unchangedCount = rows.length - changed.length
  const header = '## 📦 Bundle size · min+gzip entry\n'
  const footnote =
    '\n_Entry chunk only — workspace deps bundled; npm dependencies and lazy-loaded chunks excluded._\n'

  if (changed.length === 0) {
    return (
      header +
      `\n✅ **Unchanged vs baseline** — ${rows.length} packages checked; none differ by more than ${UNCHANGED_PERCENT_EPS}%.\n` +
      footnote
    )
  }

  changed.sort((a, b) => b.sortKey - a.sortKey)

  const increases = changed.filter((r) => r.kind === 'up').length
  const decreases = changed.filter((r) => r.kind === 'down').length
  const summaryBits = [`**${changed.length}** of **${rows.length}** packages changed`]
  if (increases) summaryBits.push(`${increases} larger`)
  if (decreases) summaryBits.push(`${decreases} smaller`)
  if (unchangedCount) summaryBits.push(`${unchangedCount} unchanged (omitted)`)

  let body = `\n${summaryBits.join(' · ')}\n\n`
  body += markdownTable(
    ['Package', 'Size', 'Δ vs baseline'],
    changed.map((r) => [`\`${r.package}\``, r.size, r.diff]),
  )

  if (unchangedCount > 0) {
    const unchangedRows = rows
      .filter((r) => r.kind === 'unchanged')
      .map((r) => [`\`${r.package}\``, r.size])
    body += `\n\n<details>\n<summary>All sizes (${rows.length} packages)</summary>\n\n`
    body += markdownTable(['Package', 'Size'], unchangedRows)
    body += '\n\n</details>'
  }

  return header + body + footnote
}

export { generateMarkdownReport, classifyRow, UNCHANGED_PERCENT_EPS }

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const result = {}
  for (const arg of args) {
    if (arg.startsWith('--baseline=')) {
      result.baseline = arg.split('=')[1]
    } else if (arg.startsWith('--output=')) {
      result.output = arg.split('=')[1]
    }
  }
  return result
}

/**
 * Main function
 */
async function main() {
  const args = parseArgs(process.argv.slice(2))
  
  if (args.baseline) {
    try {
      const baselineContent = await readFile(args.baseline, 'utf-8')
      if (!baselineContent || baselineContent.trim() === '' || baselineContent.trim() === '{}') {
        console.error('❌ Baseline file is empty or invalid')
        process.exit(1)
      }
      
      const baseline = JSON.parse(baselineContent)
      if (typeof baseline !== 'object' || baseline === null || Object.keys(baseline).length === 0) {
        console.error('❌ Baseline file contains no package data')
        process.exit(1)
      }
      
      const current = await analyzePackages()
      if (Object.keys(current).length === 0) {
        console.error('❌ No packages found in current build')
        process.exit(1)
      }
      
      const report = generateMarkdownReport(current, baseline)
      console.log(report)
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`❌ Baseline file not found: ${args.baseline}`)
      } else if (error instanceof SyntaxError) {
        console.error(`❌ Baseline file is not valid JSON: ${error.message}`)
      } else {
        console.error(`❌ Error: ${error.message}`)
      }
      process.exit(1)
    }
  } else {
    const results = await analyzePackages()

    if (args.output) {
      if (Object.keys(results).length === 0) {
        console.error('❌ No packages found to analyze. Make sure packages are built.')
        process.exit(1)
      }
      await writeFile(args.output, JSON.stringify(results, null, 2))
      console.log(`✅ Results saved to ${args.output}`)
      console.log(`📦 Analyzed ${Object.keys(results).length} packages`)
    } else {
      console.log(JSON.stringify(results, null, 2))
    }
  }
}

const isDirectRun =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirectRun) {
  main().catch((error) => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })
}

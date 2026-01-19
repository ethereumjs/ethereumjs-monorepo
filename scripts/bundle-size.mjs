#!/usr/bin/env node
/**
 * Simple bundle size analysis script
 * Calculates minified+gzipped bundle sizes for each package and compares with baseline.
 */

import { readdir, stat, readFile, writeFile } from 'fs/promises'
import { gzipSync } from 'zlib'
import { join, resolve } from 'path'
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
 * Bundle and minify a package entry and return gzipped size
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
    logLevel: 'silent',
    absWorkingDir: pkgDir,
    external,
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  })

  if (!result.outputFiles || result.outputFiles.length === 0) return 0
  const output = result.outputFiles[0].text
  return gzipSync(Buffer.from(output)).length
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
        const deps = {
          ...(packageJson.dependencies || {}),
          ...(packageJson.peerDependencies || {}),
          ...(packageJson.optionalDependencies || {}),
        }
        const external = Object.keys(deps).filter((dep) => !internalPackages.has(dep))
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

/**
 * Compare results and generate markdown table
 */
function generateComparisonTable(current, baseline) {
  const allPackages = new Set([...Object.keys(current), ...Object.keys(baseline)])
  const rows = []
  
  for (const pkg of Array.from(allPackages).sort()) {
    const currentSize = current[pkg] || 0
    const baselineSize = baseline[pkg] || 0
    
    if (baselineSize === 0 && currentSize === 0) continue
    
    let sizeDisplay = formatKB(currentSize)
    let diffDisplay = ''
    
    if (baselineSize === 0) {
      diffDisplay = '🆕 NEW'
    } else if (currentSize === 0) {
      diffDisplay = '🗑️ REMOVED'
    } else {
      const diffBytes = currentSize - baselineSize
      const diffPercent = ((diffBytes / baselineSize) * 100)
      
      if (Math.abs(diffPercent) < 0.01) {
        diffDisplay = '⚪ ±0%'
      } else if (diffBytes > 0) {
        diffDisplay = `🔴 +${formatKB(diffBytes)} (+${diffPercent.toFixed(2)}%)`
      } else {
        diffDisplay = `🟢 ${formatKB(diffBytes)} (${diffPercent.toFixed(2)}%)`
      }
    }
    
    rows.push({
      package: pkg,
      size: sizeDisplay,
      diff: diffDisplay,
    })
  }
  
  if (rows.length === 0) {
    return 'No packages found to compare.'
  }
  
  let table = '| Package | Size (min+gzip) | Δ |\n'
  table += '|---------|-----------------|---|\n'
  
  for (const row of rows) {
    table += `| ${row.package} | ${row.size} | ${row.diff} |\n`
  }
  
  return table
}

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
      
      const table = generateComparisonTable(current, baseline)
      console.log('## 📦 Bundle Size Analysis\n')
      console.log(table)
      console.log(
        '\n_Values are minified+gzipped bundles of each package entry. Workspace deps are bundled; external deps are excluded._\n'
      )
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

main().catch((error) => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})

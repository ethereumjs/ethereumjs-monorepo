#!/usr/bin/env node
/**
 * Simple bundle size analysis script
 * Calculates gzipped bundle sizes for all packages and compares with baseline
 */

import { readdir, stat, readFile, writeFile } from 'fs/promises'
import { createGzip } from 'zlib'
import { createReadStream } from 'fs'
import { join } from 'path'

const packagesDir = join(process.cwd(), 'packages')

/**
 * Get gzipped size of a file
 */
async function getGzipSize(filePath) {
  try {
    await stat(filePath)
  } catch (err) {
    return 0
  }

  return new Promise((resolve) => {
    const chunks = []
    const gzip = createGzip()
    const readStream = createReadStream(filePath)

    readStream
      .pipe(gzip)
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => {
        const size = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
        resolve(size)
      })
      .on('error', () => resolve(0))
  })
}

/**
 * Recursively find all JS files in a directory
 */
async function findJSFiles(dir) {
  const files = []
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        const subFiles = await findJSFiles(fullPath)
        files.push(...subFiles)
      } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.mjs'))) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return files
}

/**
 * Calculate total gzipped size of a directory
 */
async function calculateDirSize(dir) {
  try {
    const jsFiles = await findJSFiles(dir)
    let totalGzip = 0
    
    for (const filePath of jsFiles) {
      totalGzip += await getGzipSize(filePath)
    }
    
    return totalGzip
  } catch (error) {
    return 0
  }
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
    const results = {}
    
    for (const pkg of packages) {
      if (!pkg.isDirectory()) continue
      
      const distPath = join(packagesDir, pkg.name, 'dist')
      try {
        await stat(distPath)
        const size = await calculateDirSize(distPath)
        if (size > 0) {
          results[pkg.name] = size
        }
      } catch {
        // No dist folder
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
  
  let table = '| Package | Size (gzip) | Δ |\n'
  table += '|---------|-------------|---|\n'
  
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

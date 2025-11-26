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
  return new Promise((resolve, reject) => {
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
      .on('error', reject)
  })
}

/**
 * Calculate total gzipped size of a directory
 */
async function calculateDirSize(dir) {
  try {
    const files = await readdir(dir, { recursive: true, withFileTypes: true })
    let totalGzip = 0
    
    for (const file of files) {
      if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.mjs'))) {
        const filePath = join(file.path || dir, file.name)
        try {
          totalGzip += await getGzipSize(filePath)
        } catch (err) {
          // Skip files that can't be read
        }
      }
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
  return (bytes / 1024).toFixed(2) + ' KB'
}

/**
 * Analyze all packages
 */
async function analyzePackages() {
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
    
    let diff = ''
    if (baselineSize === 0) {
      diff = '+NEW'
    } else if (currentSize === 0) {
      diff = '-REMOVED'
    } else {
      const diffBytes = currentSize - baselineSize
      const diffPercent = ((diffBytes / baselineSize) * 100).toFixed(2)
      const sign = diffBytes >= 0 ? '+' : ''
      diff = `${sign}${formatKB(diffBytes)} (${sign}${diffPercent}%)`
    }
    
    rows.push({
      package: pkg,
      current: currentSize,
      baseline: baselineSize,
      diff,
    })
  }
  
  // Generate markdown table
  let table = '| Package | Size Δ |\n'
  table += '|---------|--------|\n'
  
  for (const row of rows) {
    table += `| ${row.package} | ${row.diff} |\n`
  }
  
  return table
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--baseline')) {
    // Load baseline and compare
    const baselineFile = args.find(arg => arg.startsWith('--baseline='))?.split('=')[1]
    if (!baselineFile) {
      console.error('❌ --baseline requires a file path')
      process.exit(1)
    }
    
    const baseline = JSON.parse(await readFile(baselineFile, 'utf-8'))
    const current = await analyzePackages()
    
    const table = generateComparisonTable(current, baseline)
    console.log('## 📦 Bundle Size Analysis\n')
    console.log(table)
    
    // Output JSON for CI
    if (args.includes('--json')) {
      console.log('\n---JSON_START---')
      console.log(JSON.stringify({ current, baseline }, null, 2))
      console.log('---JSON_END---')
    }
  } else {
    // Just analyze current
    const results = await analyzePackages()
    const output = args.find(arg => arg.startsWith('--output='))?.split('=')[1]
    
    if (output) {
      await writeFile(output, JSON.stringify(results, null, 2))
      console.log(`✅ Results saved to ${output}`)
    } else {
      console.log(JSON.stringify(results, null, 2))
    }
  }
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})

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
  // Check if file exists first
  try {
    await stat(filePath)
  } catch (err) {
    return 0
  }

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
      .on('error', (err) => {
        // Silently ignore errors (file might be deleted, etc.)
        resolve(0)
      })
  })
}

/**
 * Calculate total gzipped size of a directory
 */
async function calculateDirSize(dir) {
  try {
    const files = await readdir(dir, { recursive: true, withFileTypes: true })
    let totalGzip = 0
    let fileCount = 0
    
    for (const file of files) {
      if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.mjs'))) {
        const filePath = join(file.path || dir, file.name)
        const size = await getGzipSize(filePath)
        totalGzip += size
        if (size > 0) {
          fileCount++
        }
      }
    }
    
    return { size: totalGzip, fileCount }
  } catch (error) {
    return { size: 0, fileCount: 0 }
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
  try {
    console.error(`📂 Looking for packages in: ${packagesDir}`)
    const packages = await readdir(packagesDir, { withFileTypes: true })
    console.error(`📦 Found ${packages.length} items in packages directory`)
    const results = {}
    
    for (const pkg of packages) {
      if (!pkg.isDirectory()) {
        console.error(`⏭️  Skipping non-directory: ${pkg.name}`)
        continue
      }
      
      const distPath = join(packagesDir, pkg.name, 'dist')
      try {
        await stat(distPath)
        console.error(`📊 Analyzing ${pkg.name}...`)
        const result = await calculateDirSize(distPath); const size = result.size; const fileCount = result.fileCount
        console.error(`   Found ${fileCount} JS files, total size: ${formatKB(size)}`)
        if (size > 0) {
          results[pkg.name] = size
        } else {
          console.error(`   ⚠️  No size calculated for ${pkg.name}`)
        }
      } catch (err) {
        console.error(`   ⏭️  No dist folder for ${pkg.name}`)
      }
    }
    
    console.error(`✅ Analysis complete: ${Object.keys(results).length} packages with size > 0`)
    return results
  } catch (error) {
    console.error(`❌ Error in analyzePackages: ${error.message}`)
    console.error(`   packagesDir: ${packagesDir}`)
    console.error(`   cwd: ${process.cwd()}`)
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
  if (rows.length === 0) {
    return 'No packages found to compare.'
  }
  
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
    
    try {
      const baselineContent = await readFile(baselineFile, 'utf-8')
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
        console.error(`❌ Baseline file not found: ${baselineFile}`)
      } else if (error instanceof SyntaxError) {
        console.error(`❌ Baseline file is not valid JSON: ${error.message}`)
      } else {
        console.error(`❌ Error: ${error.message}`)
      }
      process.exit(1)
    }
  } else {
    // Just analyze current
    const results = await analyzePackages()
    const output = args.find(arg => arg.startsWith('--output='))?.split('=')[1]
    
    if (output) {
      // Only write if we have results
      if (Object.keys(results).length === 0) {
        console.error('❌ No packages found to analyze. Make sure packages are built.')
        process.exit(1)
      }
      await writeFile(output, JSON.stringify(results, null, 2))
      console.log(`✅ Results saved to ${output}`)
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

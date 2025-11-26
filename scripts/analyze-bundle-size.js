#!/usr/bin/env node
/**
 * Bundle size analysis script for EthereumJS monorepo
 * Analyzes the dist folder sizes for all packages and reports bundle sizes
 * Supports comparison mode to compare against a baseline
 */

import { readdir, stat, writeFile, readFile, mkdir } from 'fs/promises'
import { createGzip } from 'zlib'
import { createReadStream } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const packagesDir = join(rootDir, 'packages')

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
 * Recursively get all files in a directory
 */
async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir, { withFileTypes: true })
  
  for (const file of files) {
    const filePath = join(dir, file.name)
    
    if (file.isDirectory()) {
      await getAllFiles(filePath, fileList)
    } else if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.mjs'))) {
      fileList.push(filePath)
    }
  }
  
  return fileList
}

/**
 * Calculate total size of a directory
 */
async function calculateDirSize(dir) {
  try {
    const files = await getAllFiles(dir)
    let totalSize = 0
    let totalGzipSize = 0
    
    for (const file of files) {
      const stats = await stat(file)
      totalSize += stats.size
      totalGzipSize += await getGzipSize(file)
    }
    
    return { raw: totalSize, gzip: totalGzipSize, fileCount: files.length }
  } catch (error) {
    // Directory doesn't exist or is empty
    return { raw: 0, gzip: 0, fileCount: 0 }
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format difference with sign and color indicators
 */
function formatDiff(current, baseline) {
  if (baseline === 0) return current > 0 ? '+NEW' : '0 B'
  const diff = current - baseline
  const percent = ((diff / baseline) * 100).toFixed(1)
  const sign = diff >= 0 ? '+' : ''
  return `${sign}${formatBytes(diff)} (${sign}${percent}%)`
}

/**
 * Analyze bundle sizes for all packages
 */
async function analyzeBundleSizes(packagesDirPath = packagesDir) {
  const packages = await readdir(packagesDirPath, { withFileTypes: true })
  const results = []
  
  for (const pkg of packages) {
    if (!pkg.isDirectory()) continue
    
    const packagePath = join(packagesDirPath, pkg.name)
    const distPath = join(packagePath, 'dist')
    
    // Check if dist folder exists
    try {
      await stat(distPath)
    } catch {
      // No dist folder, skip
      continue
    }
    
    // Calculate sizes for both ESM and CJS builds
    const esmPath = join(distPath, 'esm')
    const cjsPath = join(distPath, 'cjs')
    
    const esmSize = await calculateDirSize(esmPath)
    const cjsSize = await calculateDirSize(cjsPath)
    
    const totalRaw = esmSize.raw + cjsSize.raw
    const totalGzip = esmSize.gzip + cjsSize.gzip
    
    results.push({
      package: pkg.name,
      esm: esmSize,
      cjs: cjsSize,
      total: { raw: totalRaw, gzip: totalGzip },
    })
  }
  
  // Sort by total size (descending)
  results.sort((a, b) => b.total.raw - a.total.raw)
  
  return results
}

/**
 * Print analysis results
 */
function printResults(results, title = '📊 Bundle Size Analysis Results') {
  console.log(`\n${title}\n`)
  console.log('Package'.padEnd(20) + 'ESM Raw'.padEnd(12) + 'ESM Gzip'.padEnd(12) + 'CJS Raw'.padEnd(12) + 'CJS Gzip'.padEnd(12) + 'Total Raw'.padEnd(12) + 'Total Gzip')
  console.log('-'.repeat(100))
  
  for (const result of results) {
    if (result.total.raw === 0) continue
    
    const esmRaw = formatBytes(result.esm.raw)
    const esmGzip = formatBytes(result.esm.gzip)
    const cjsRaw = formatBytes(result.cjs.raw)
    const cjsGzip = formatBytes(result.cjs.gzip)
    const totalRaw = formatBytes(result.total.raw)
    const totalGzip = formatBytes(result.total.gzip)
    
    console.log(
      result.package.padEnd(20) +
      esmRaw.padEnd(12) +
      esmGzip.padEnd(12) +
      cjsRaw.padEnd(12) +
      cjsGzip.padEnd(12) +
      totalRaw.padEnd(12) +
      totalGzip
    )
  }
}

/**
 * Compare current results with baseline
 */
function compareResults(current, baseline) {
  const baselineMap = new Map(baseline.map(r => [r.package, r]))
  const comparison = []
  
  // Get all unique packages
  const allPackages = new Set([...current.map(r => r.package), ...baseline.map(r => r.package)])
  
  for (const pkg of allPackages) {
    const currentResult = current.find(r => r.package === pkg)
    const baselineResult = baselineMap.get(pkg)
    
    if (!currentResult && !baselineResult) continue
    
    const currentTotal = currentResult?.total || { raw: 0, gzip: 0 }
    const baselineTotal = baselineResult?.total || { raw: 0, gzip: 0 }
    
    comparison.push({
      package: pkg,
      current: currentTotal,
      baseline: baselineTotal,
      diff: {
        raw: currentTotal.raw - baselineTotal.raw,
        gzip: currentTotal.gzip - baselineTotal.gzip,
      },
    })
  }
  
  // Sort by absolute difference (descending)
  comparison.sort((a, b) => Math.abs(b.diff.raw) - Math.abs(a.diff.raw))
  
  return comparison
}

/**
 * Print comparison results
 */
function printComparison(comparison) {
  console.log('\n📊 Bundle Size Comparison (Current vs Baseline)\n')
  console.log(
    'Package'.padEnd(20) +
    'Baseline Raw'.padEnd(15) +
    'Current Raw'.padEnd(15) +
    'Diff Raw'.padEnd(20) +
    'Baseline Gzip'.padEnd(15) +
    'Current Gzip'.padEnd(15) +
    'Diff Gzip'
  )
  console.log('-'.repeat(120))
  
  let hasChanges = false
  for (const comp of comparison) {
    if (comp.current.raw === 0 && comp.baseline.raw === 0) continue
    
    const baselineRaw = formatBytes(comp.baseline.raw)
    const currentRaw = formatBytes(comp.current.raw)
    const diffRaw = formatDiff(comp.current.raw, comp.baseline.raw)
    const baselineGzip = formatBytes(comp.baseline.gzip)
    const currentGzip = formatBytes(comp.current.gzip)
    const diffGzip = formatDiff(comp.current.gzip, comp.baseline.gzip)
    
    // Highlight significant changes (>5% or >10KB)
    const rawChangePercent = comp.baseline.raw > 0 ? (comp.diff.raw / comp.baseline.raw) * 100 : 0
    const significantChange = Math.abs(rawChangePercent) > 5 || Math.abs(comp.diff.raw) > 10240
    
    if (significantChange && comp.diff.raw !== 0) {
      hasChanges = true
      const indicator = comp.diff.raw > 0 ? '⚠️ ' : '✅ '
      console.log(
        indicator + comp.package.padEnd(18) +
        baselineRaw.padEnd(15) +
        currentRaw.padEnd(15) +
        diffRaw.padEnd(20) +
        baselineGzip.padEnd(15) +
        currentGzip.padEnd(15) +
        diffGzip
      )
    } else {
      console.log(
        '  ' + comp.package.padEnd(18) +
        baselineRaw.padEnd(15) +
        currentRaw.padEnd(15) +
        diffRaw.padEnd(20) +
        baselineGzip.padEnd(15) +
        currentGzip.padEnd(15) +
        diffGzip
      )
    }
  }
  
  if (hasChanges) {
    console.log('\n⚠️  Significant changes detected (>5% or >10KB)')
  }
}

/**
 * Save results to JSON file
 */
/**
 * Generate markdown summary for PR comment
 */
function generateSummary(comparison, baselineRef = 'baseline') {
  if (!comparison || comparison.length === 0) {
    return '## 📦 Bundle Size Analysis\n\nNo bundle size data available.'
  }
  
  // Calculate totals
  let totalBaselineRaw = 0
  let totalCurrentRaw = 0
  let totalBaselineGzip = 0
  let totalCurrentGzip = 0
  
  for (const comp of comparison) {
    totalBaselineRaw += comp.baseline.raw
    totalCurrentRaw += comp.current.raw
    totalBaselineGzip += comp.baseline.gzip
    totalCurrentGzip += comp.current.gzip
  }
  
  const totalDiffRaw = totalCurrentRaw - totalBaselineRaw
  const totalDiffGzip = totalCurrentGzip - totalBaselineGzip
  const totalDiffPercentRaw = totalBaselineRaw > 0 ? ((totalDiffRaw / totalBaselineRaw) * 100).toFixed(2) : '0.00'
  const totalDiffPercentGzip = totalBaselineGzip > 0 ? ((totalDiffGzip / totalBaselineGzip) * 100).toFixed(2) : '0.00'
  
  const signRaw = totalDiffRaw >= 0 ? '+' : ''
  const signGzip = totalDiffGzip >= 0 ? '+' : ''
  
  let summary = `## 📦 Bundle Size Analysis\n\n`
  summary += `**Total Bundle Size:** ${formatBytes(totalCurrentRaw)} (${formatBytes(totalCurrentGzip)} gzipped)\n`
  summary += `**Change:** ${signRaw}${formatBytes(totalDiffRaw)} (${signRaw}${totalDiffPercentRaw}%) / ${signGzip}${formatBytes(totalDiffGzip)} (${signGzip}${totalDiffPercentGzip}%) gzipped\n\n`
  summary += `Compared to ${baselineRef}\n\n`
  
  // Table header
  summary += `| Package | Baseline | Current | Change |\n`
  summary += `|---------|----------|---------|--------|\n`
  
  // Add rows for packages with changes
  let hasSignificantChanges = false
  for (const comp of comparison) {
    if (comp.current.raw === 0 && comp.baseline.raw === 0) continue
    
    const rawChangePercent = comp.baseline.raw > 0 ? (comp.diff.raw / comp.baseline.raw) * 100 : 0
    const significantChange = Math.abs(rawChangePercent) > 5 || Math.abs(comp.diff.raw) > 10240
    
    if (Math.abs(comp.diff.raw) > 0 || Math.abs(comp.diff.gzip) > 0) {
      const baselineGzip = formatBytes(comp.baseline.gzip)
      const currentGzip = formatBytes(comp.current.gzip)
      const diffGzip = formatDiff(comp.current.gzip, comp.baseline.gzip)
      
      const indicator = significantChange ? (comp.diff.raw > 0 ? '⚠️ ' : '✅ ') : ''
      const changeText = `${formatDiff(comp.current.raw, comp.baseline.raw)} / ${diffGzip}`
      
      summary += `| ${indicator}**${comp.package}** | ${baselineGzip} | ${currentGzip} | ${changeText} |\n`
      
      if (significantChange) {
        hasSignificantChanges = true
      }
    }
  }
  
  if (hasSignificantChanges) {
    summary += `\n⚠️ **Significant changes detected** (>5% or >10KB)\n`
  }
  
  return summary
}

async function saveResults(results, filePath) {
  await writeFile(filePath, JSON.stringify(results, null, 2))
}

/**
 * Load results from JSON file
 */
async function loadResults(filePath) {
  try {
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  const compareMode = args.includes('--compare') || args.includes('-c')
  const baselineFile = args.find(arg => arg.startsWith('--baseline='))?.split('=')[1] || 
                       args.find(arg => arg.startsWith('-b='))?.split('=')[1]
  
  if (compareMode && baselineFile) {
    // Comparison mode
    console.log('📦 Analyzing current bundle sizes...')
    const currentResults = await analyzeBundleSizes()
    
    console.log('📦 Loading baseline results...')
    const baselineResults = await loadResults(baselineFile)
    
    if (!baselineResults) {
      console.error(`❌ Baseline file not found: ${baselineFile}`)
      process.exit(1)
    }
    
    printResults(baselineResults, '📊 Baseline Bundle Sizes')
    printResults(currentResults, '📊 Current Bundle Sizes')
    
    const comparison = compareResults(currentResults, baselineResults)
    printComparison(comparison)
    
    // Generate summary if requested
    if (args.includes('--summary') || args.includes('--summary-file')) {
      const summaryFile = args.find(arg => arg.startsWith('--summary-file='))?.split('=')[1]
      const baselineRef = args.find(arg => arg.startsWith('--baseline-ref='))?.split('=')[1] || 'baseline'
      const summary = generateSummary(comparison, baselineRef)
      
      if (summaryFile) {
        await writeFile(summaryFile, summary)
        console.log(`
📝 Summary saved to ${summaryFile}`)
      } else {
        // Output to stdout for CI to capture
        console.log('
---SUMMARY_START---')
        console.log(summary)
        console.log('---SUMMARY_END---')
      }
    }
    
    console.log('
✅ Bundle size comparison complete')
  } else if (args.includes('--save') || args.includes('-s')) {
    // Save mode - save current results to file
    const outputFile = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || 
                       args.find(arg => arg.startsWith('-o='))?.split('=')[1] ||
                       'bundle-size-baseline.json'
    
    console.log('📦 Analyzing bundle sizes...')
    const results = await analyzeBundleSizes()
    
    await saveResults(results, outputFile)
    console.log(`\n✅ Results saved to ${outputFile}`)
    printResults(results)
  } else {
    // Normal mode - just analyze and print
    console.log('📦 Analyzing bundle sizes...\n')
    const results = await analyzeBundleSizes()
    printResults(results)
    console.log('\n✅ Bundle size analysis complete')
    console.log('\n💡 Tip: Use --save to save baseline, --compare --baseline=<file> to compare')
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
}

export { analyzeBundleSizes, compareResults, saveResults, loadResults }

#!/usr/bin/env tsx
/**
 * Render the @EFJavaScript profile banner (Twitter: 1500×500).
 *
 * Usage:
 *   tsx scripts/render-twitter-banner.ts [--out=<path>]
 */

import { mkdirSync, readFileSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'
import { createHighlighter } from 'shiki'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const TEMPLATE_PATH = join(REPO_ROOT, 'config/code-snippet/twitter-banner.html')
const DEFAULT_OUT = join(REPO_ROOT, 'tmp/announce/twitter-banner.png')

const BANNER_SOURCE = `import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createVM } from '@ethereumjs/vm'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
const vm = await createVM({ common })
`

async function main(): Promise<void> {
  const outArg = process.argv.slice(2).find((arg) => arg.startsWith('--out='))
  const outputPath = outArg?.slice('--out='.length) ?? DEFAULT_OUT

  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['typescript'],
  })
  const highlightedCode = highlighter.codeToHtml(BANNER_SOURCE.trimEnd(), {
    lang: 'typescript',
    theme: 'github-dark',
  })

  const html = readFileSync(TEMPLATE_PATH, 'utf8').replace(
    '{{HIGHLIGHTED_CODE}}',
    highlightedCode,
  )

  mkdirSync(dirname(outputPath), { recursive: true })

  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      viewport: { width: 1500, height: 500 },
      deviceScaleFactor: 2,
    })
    await page.setContent(html, { waitUntil: 'load' })
    await page.locator('#banner').screenshot({
      path: outputPath,
      type: 'png',
    })
  } finally {
    await browser.close()
  }

  console.log(`Wrote ${relative(REPO_ROOT, outputPath)}`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

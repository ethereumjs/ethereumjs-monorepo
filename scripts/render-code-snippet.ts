#!/usr/bin/env tsx
/**
 * Render a package example file to a syntax-highlighted PNG for social posts.
 *
 * Offline only: reads local files under packages/<pkg>/examples/, highlights with Shiki,
 * screenshots via Playwright (Chromium must be installed — npm run install-browser-deps).
 *
 * Usage:
 *   tsx scripts/render-code-snippet.ts --file=<path> [--out=<path>] [--title=<text>]
 *     [--lines=<start>-<end>] [--theme=<shiki-theme>] [--lang=<lang>] [--scale=<n>]
 *
 * Examples:
 *   npm run snippet:png -- --file=packages/vm/examples/runTxGasDimensions.ts
 *   npm run snippet:png -- --file=packages/vm/examples/runTxGasDimensions.ts \
 *     --lines=12-35 --title="Amsterdam VM gas dimensions" --out=tmp/announce/amsterdam.png
 */

import { existsSync, mkdirSync, readFileSync, realpathSync } from 'fs'
import { basename, dirname, extname, join, relative, resolve } from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'
import { createHighlighter, type BundledLanguage, type BundledTheme } from 'shiki'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const TEMPLATE_PATH = join(REPO_ROOT, 'config/code-snippet/template.html')
const EXAMPLES_PATH_RE = /^packages\/[^/]+\/examples\//

const DEFAULT_THEME: BundledTheme = 'github-dark'
const DEFAULT_FONT_SIZE = 14
const DEFAULT_SCALE = 2

interface ParsedArgs {
  file: string
  out?: string
  title?: string
  lines?: string
  theme: BundledTheme
  lang?: BundledLanguage
  scale: number
  fontSize: number
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2)

  const get = (prefix: string): string | undefined => {
    const match = args.find((arg) => arg.startsWith(`${prefix}=`))
    return match?.slice(prefix.length + 1)
  }

  const file = get('--file')
  if (!file) {
    throw new Error('--file=<path> is required (must be under packages/<pkg>/examples/)')
  }

  const scaleRaw = get('--scale')
  const fontSizeRaw = get('--font-size')
  const scale = scaleRaw ? Number(scaleRaw) : DEFAULT_SCALE
  const fontSize = fontSizeRaw ? Number(fontSizeRaw) : DEFAULT_FONT_SIZE

  if (!Number.isFinite(scale) || scale < 1 || scale > 4) {
    throw new Error('--scale must be a number between 1 and 4')
  }
  if (!Number.isFinite(fontSize) || fontSize < 10 || fontSize > 24) {
    throw new Error('--font-size must be a number between 10 and 24')
  }

  return {
    file,
    out: get('--out'),
    title: get('--title'),
    lines: get('--lines'),
    theme: (get('--theme') ?? DEFAULT_THEME) as BundledTheme,
    lang: get('--lang') as BundledLanguage | undefined,
    scale,
    fontSize,
  }
}

function assertAllowedInputPath(filePath: string): string {
  const abs = resolve(REPO_ROOT, filePath)
  if (!existsSync(abs)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const real = realpathSync(abs)
  const rel = relative(REPO_ROOT, real).split('\\').join('/')

  if (rel.startsWith('..') || !EXAMPLES_PATH_RE.test(rel)) {
    throw new Error(`Input must be under packages/<pkg>/examples/: ${filePath}`)
  }

  return real
}

function extractLines(content: string, range?: string): string {
  if (!range) {
    return content.replace(/\n$/, '')
  }

  const match = /^(\d+)(?:-(\d+))?$/.exec(range.trim())
  if (!match) {
    throw new Error('--lines must look like 10 or 10-25')
  }

  const start = Number(match[1])
  const end = match[2] ? Number(match[2]) : start

  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) {
    throw new Error('--lines must use 1-based line numbers with start <= end')
  }

  const lines = content.split('\n')
  if (start > lines.length) {
    throw new Error(`--lines start ${start} exceeds file length (${lines.length})`)
  }

  return lines.slice(start - 1, end).join('\n')
}

function inferLanguage(filePath: string): BundledLanguage {
  switch (extname(filePath)) {
    case '.ts':
    case '.tsx':
    case '.mts':
    case '.cts':
      return 'typescript'
    case '.js':
    case '.jsx':
    case '.mjs':
    case '.cjs':
      return 'javascript'
    case '.json':
      return 'json'
    case '.md':
      return 'markdown'
    case '.sh':
      return 'bash'
    default:
      throw new Error(`Cannot infer language for ${filePath}; pass --lang=`)
  }
}

function defaultOutputPath(inputPath: string): string {
  const stem = basename(inputPath, extname(inputPath))
  return join(REPO_ROOT, 'tmp/announce', `${stem}.png`)
}

function buildHtml(
  template: string,
  highlightedCode: string,
  title: string | undefined,
  fontSize: number,
): string {
  const titleBlock = title
    ? `<div class="title">${escapeHtml(title)}</div>`
    : ''

  return template
    .replaceAll('{{FONT_SIZE}}', String(fontSize))
    .replace('{{TITLE_BLOCK}}', titleBlock)
    .replace('{{HIGHLIGHTED_CODE}}', highlightedCode)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

async function main(): Promise<void> {
  const args = parseArgs()
  const inputPath = assertAllowedInputPath(args.file)
  const outputPath = resolve(REPO_ROOT, args.out ?? defaultOutputPath(inputPath))
  const source = readFileSync(inputPath, 'utf8')
  const snippet = extractLines(source, args.lines)
  const lang = args.lang ?? inferLanguage(inputPath)

  const highlighter = await createHighlighter({
    themes: [args.theme],
    langs: [lang],
  })

  const highlightedCode = highlighter.codeToHtml(snippet, {
    lang,
    theme: args.theme,
  })

  const template = readFileSync(TEMPLATE_PATH, 'utf8')
  const html = buildHtml(template, highlightedCode, args.title, args.fontSize)

  mkdirSync(dirname(outputPath), { recursive: true })

  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      deviceScaleFactor: args.scale,
    })
    await page.setContent(html, { waitUntil: 'load' })
    await page.locator('#snippet-card').screenshot({
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

/**
 * Step 1 migration: retitle it('should …') per api-tests.mdc.
 * Usage: node scripts/retitle-should-it.mjs [--write]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walkSpecs(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    const p = join(dir, name)
    let st
    try {
      st = statSync(p)
    } catch {
      continue
    }
    if (st.isDirectory()) walkSpecs(p, out)
    else if (name.endsWith('.spec.ts')) out.push(p)
  }
  return out
}

const write = process.argv.includes('--write')

const GLOB = 'packages/*/test/**/*.spec.ts'
const EXCLUDE = [
  'packages/vm/test/tester/',
  'packages/vm/test/t8n/',
  'packages/vm/test/retesteth/',
  'packages/wallet/',
  'packages/ethash/',
]

function transformShouldTitle(title) {
  if (!title.startsWith('should ')) return { title, changed: false }

  let t = title.slice('should '.length)

  if (t === 'work') return { title: '__SHOULD_WORK__', changed: false, placeholder: true }

  let out = t

  if (t.startsWith('not ')) out = `does not ${t.slice(4)}`
  else if (t.startsWith('fail to ')) out = `fails to ${t.slice(8)}`
  else if (t.startsWith('fail ')) out = `fails ${t.slice(5)}`
  else if (t.startsWith('return ')) out = `returns ${t.slice(7)}`
  else if (t.startsWith('throw ')) out = `throws ${t.slice(6)}`
  else if (t.startsWith('reject ')) out = `rejects ${t.slice(7)}`
  else if (t.startsWith('test ')) out = t.slice(5)
  else if (t.startsWith('be ')) out = `is ${t.slice(3)}`
  else if (t.startsWith('have ')) out = `has ${t.slice(5)}`
  else if (t.startsWith('read ')) out = `reads ${t.slice(5)}`
  else if (t.startsWith('write ')) out = `writes ${t.slice(6)}`
  else if (t.startsWith('encode ')) out = `encodes ${t.slice(7)}`
  else if (t.startsWith('decode ')) out = `decodes ${t.slice(7)}`
  else if (t.startsWith('handle ')) out = `handles ${t.slice(7)}`
  else if (t.startsWith('validate ')) out = `validates ${t.slice(9)}`
  else if (t.startsWith('accept ')) out = `accepts ${t.slice(7)}`
  else if (t.startsWith('correctly ')) out = t.slice(10)
  else {
    const m = t.match(/^([a-z]+)( .*)?$/)
    if (m) {
      const verb = m[1]
      const rest = m[2] ?? ''
      const irregular = new Set(['pass', 'is', 'has', 'does', 'go', 'do', 'be', 'run', 'set', 'get'])
      const adverbLike = verb.endsWith('ly') || verb === 'only' || verb === 'also'
      if (!irregular.has(verb) && !verb.endsWith('s') && !adverbLike) {
        out = `${verb}s${rest}`
      }
    }
  }

  return { title: out, changed: out !== title, placeholder: false }
}

function processFile(path) {
  if (EXCLUDE.some((p) => path.includes(p))) return null

  let src = readFileSync(path, 'utf8')
  let changes = 0
  let placeholders = 0

  const replaceTitle = (full, quote, title) => {
    const r = transformShouldTitle(title)
    if (r.placeholder) {
      placeholders++
      return full
    }
    if (r.changed) {
      changes++
      return `it(${quote}${r.title}${quote}`
    }
    return full
  }

  src = src.replace(/\bit\(\s*(['"])(should (?:(?!\1).)+)\1/g, replaceTitle)
  src = src.replace(/\bit\(\s*`(should [^`]+)`/g, (full, title) => {
    const r = transformShouldTitle(title)
    if (r.placeholder) {
      placeholders++
      return full
    }
    if (r.changed) {
      changes++
      return `it(\`${r.title}\``
    }
    return full
  })

  if (write && changes > 0) writeFileSync(path, src)
  return { path, changes, placeholders }
}

const files = walkSpecs('packages').filter((p) => p.includes('/test/'))
const results = files.map(processFile).filter(Boolean)

const totalChanges = results.reduce((a, r) => a + r.changes, 0)
const totalPh = results.reduce((a, r) => a + r.placeholders, 0)

console.log(`changed ${totalChanges} titles in ${results.filter((r) => r.changes > 0).length} files; placeholders ${totalPh}`)
if (totalPh > 0) {
  for (const r of results.filter((x) => x.placeholders > 0)) {
    console.log(`  placeholder ${r.path}: ${r.placeholders}`)
  }
}

if (!write) console.log('Dry run — pass --write to apply')

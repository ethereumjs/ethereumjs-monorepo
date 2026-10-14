import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'

import {
  buildFilteredIndex,
  filterIndexCases,
  parseFixturesIndex,
  tarMembersForCases,
} from './indexMeta.ts'
import {
  type FixturesManifest,
  type ReleaseSource,
  defaultCacheRoot,
  extractedFixturesRoot,
  loadManifest,
  manifestPath,
  releaseCacheDir,
} from './manifest.ts'

export type CompleteRecord = {
  releaseSha256: string
  extractForks?: string[]
  caseCount?: number
}

export function readCompleteRecord(markerPath: string): CompleteRecord | undefined {
  if (!fs.existsSync(markerPath)) return undefined
  const raw = fs.readFileSync(markerPath, 'utf8').trim()
  try {
    return JSON.parse(raw) as CompleteRecord
  } catch {
    return { releaseSha256: raw }
  }
}

export function writeCompleteRecord(markerPath: string, record: CompleteRecord): void {
  fs.writeFileSync(markerPath, `${JSON.stringify(record)}\n`)
}

function extractForksMatch(source: ReleaseSource, record: CompleteRecord): boolean {
  if (source.extractForks === undefined || source.extractForks.length === 0) {
    return record.extractForks === undefined
  }
  const want = [...source.extractForks].sort().join(',')
  const got = record.extractForks === undefined ? '' : [...record.extractForks].sort().join(',')
  return want === got
}

function sha256File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    const stream = fs.createReadStream(filePath)
    stream.on('error', reject)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}

async function download(url: string, dest: string, expectedSize?: number): Promise<void> {
  const part = `${dest}.part`
  if (fs.existsSync(part)) fs.unlinkSync(part)
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok || res.body === null) {
    throw new Error(`Download failed ${res.status} ${url}`)
  }
  const contentLength = res.headers.get('content-length')
  if (expectedSize !== undefined && contentLength !== null) {
    const len = Number(contentLength)
    if (Number.isFinite(len) && len !== expectedSize) {
      throw new Error(`Size mismatch for ${url}: expected ${expectedSize}, got ${len}`)
    }
  }
  await pipeline(res.body as unknown as NodeJS.ReadableStream, fs.createWriteStream(part))
  fs.renameSync(part, dest)
}

function runTarExtract(archive: string, destDir: string, members: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(destDir, { recursive: true })
    const args = ['-xzf', archive, '-C', destDir, ...members]
    const child = spawn('tar', args, { stdio: 'inherit' })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`tar exited ${code}`))
    })
  })
}

function runTarExtractFromList(archive: string, destDir: string, listPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(destDir, { recursive: true })
    const args = ['-xzf', archive, '-C', destDir, '-T', listPath]
    const child = spawn('tar', args, { stdio: 'inherit' })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`tar exited ${code}`))
    })
  })
}

async function extractForkSubset(
  archivePath: string,
  source: ReleaseSource,
  baseDir: string,
): Promise<{ fixturesRoot: string; caseCount: number }> {
  const forkSet = new Set(source.extractForks)
  if (forkSet.size === 0) {
    throw new Error('extractForks is empty')
  }

  const indexStage = path.join(baseDir, 'index-stage')
  if (fs.existsSync(indexStage)) fs.rmSync(indexStage, { recursive: true, force: true })
  fs.mkdirSync(indexStage, { recursive: true })

  process.stderr.write(`Reading index from ${source.tag}…\n`)
  await runTarExtract(archivePath, indexStage, ['fixtures/.meta/index.json'])
  const indexPath = path.join(indexStage, 'fixtures', '.meta', 'index.json')
  const index = parseFixturesIndex(fs.readFileSync(indexPath, 'utf8'))
  const cases = filterIndexCases(index, forkSet)
  if (cases.length === 0) {
    throw new Error(`No runnable cases for forks ${[...forkSet].join(', ')} in ${source.tag}`)
  }

  const members = tarMembersForCases(cases)
  const listPath = path.join(baseDir, 'extract-members.txt')
  fs.writeFileSync(listPath, `${members.join('\n')}\n`)

  const tmpExtract = path.join(baseDir, 'extract-tmp')
  if (fs.existsSync(tmpExtract)) fs.rmSync(tmpExtract, { recursive: true, force: true })
  fs.mkdirSync(tmpExtract, { recursive: true })

  process.stderr.write(
    `Extracting ${cases.length} Hegota cases (${members.length - 1} JSON files) from ${source.tag}…\n`,
  )
  await runTarExtractFromList(archivePath, tmpExtract, listPath)
  fs.unlinkSync(listPath)
  fs.rmSync(indexStage, { recursive: true, force: true })

  const filteredIndex = buildFilteredIndex(index, cases)
  const metaDir = path.join(tmpExtract, 'fixtures', '.meta')
  fs.mkdirSync(metaDir, { recursive: true })
  fs.writeFileSync(path.join(metaDir, 'index.json'), `${JSON.stringify(filteredIndex, null, 2)}\n`)

  const finalExtracted = path.join(baseDir, 'extracted')
  if (fs.existsSync(finalExtracted)) fs.rmSync(finalExtracted, { recursive: true, force: true })
  fs.renameSync(path.join(tmpExtract, 'fixtures'), finalExtracted)
  fs.rmSync(tmpExtract, { recursive: true, force: true })

  return { fixturesRoot: finalExtracted, caseCount: cases.length }
}

export async function fetchReleaseSource(
  sourceName: string,
  options?: { cacheRoot?: string; force?: boolean },
): Promise<string> {
  const manifest = loadManifest()
  const source = manifest.sources[sourceName]
  if (source === undefined || source.kind !== 'release') {
    throw new Error(`Source "${sourceName}" is not a release download`)
  }
  return fetchRelease(sourceName, source, options)
}

async function fetchRelease(
  sourceName: string,
  source: ReleaseSource,
  options?: { cacheRoot?: string; force?: boolean },
): Promise<string> {
  const cacheRoot = options?.cacheRoot ?? defaultCacheRoot()
  const baseDir = releaseCacheDir(sourceName, source.tag, cacheRoot)
  const completeMarker = path.join(baseDir, '.complete')
  const fixturesRoot = extractedFixturesRoot(sourceName, source.tag, cacheRoot)

  if (options?.force !== true && fs.existsSync(completeMarker)) {
    const recorded = readCompleteRecord(completeMarker)
    if (
      recorded !== undefined &&
      recorded.releaseSha256 === source.sha256 &&
      extractForksMatch(source, recorded) &&
      fs.existsSync(path.join(fixturesRoot, '.meta', 'index.json'))
    ) {
      const hasRunnableTree =
        fs.existsSync(path.join(fixturesRoot, 'state_tests')) ||
        fs.existsSync(path.join(fixturesRoot, 'blockchain_tests'))
      if (hasRunnableTree) return fixturesRoot
    }
  }

  fs.mkdirSync(baseDir, { recursive: true })
  const archivePath = path.join(baseDir, source.asset)

  if (!fs.existsSync(archivePath) || options?.force === true) {
    process.stderr.write(`Downloading ${source.tag} (${source.asset})…\n`)
    await download(source.url, archivePath, source.size)
  }

  const digest = await sha256File(archivePath)
  if (digest !== source.sha256) {
    throw new Error(
      `SHA256 mismatch for ${source.tag}: expected ${source.sha256}, got ${digest}. Re-download or bump manifest.`,
    )
  }

  let caseCount: number | undefined
  if (source.extractForks !== undefined && source.extractForks.length > 0) {
    const result = await extractForkSubset(archivePath, source, baseDir)
    caseCount = result.caseCount
  } else {
    const tmpExtract = path.join(baseDir, 'extract-tmp')
    if (fs.existsSync(tmpExtract)) {
      fs.rmSync(tmpExtract, { recursive: true, force: true })
    }
    fs.mkdirSync(tmpExtract, { recursive: true })

    process.stderr.write(`Extracting ${source.extractPaths.join(', ')}…\n`)
    await runTarExtract(archivePath, tmpExtract, source.extractPaths)

    const finalExtracted = path.join(baseDir, 'extracted')
    if (fs.existsSync(finalExtracted)) {
      fs.rmSync(finalExtracted, { recursive: true, force: true })
    }
    fs.renameSync(path.join(tmpExtract, 'fixtures'), finalExtracted)
    fs.rmSync(tmpExtract, { recursive: true, force: true })
  }

  const retainTarball =
    source.retainTarball === true ||
    source.extractForks === undefined ||
    source.extractForks.length === 0
  if (!retainTarball && fs.existsSync(archivePath)) {
    fs.unlinkSync(archivePath)
    process.stderr.write(`Removed tarball from cache (selective extract).\n`)
  }

  writeCompleteRecord(completeMarker, {
    releaseSha256: source.sha256,
    extractForks: source.extractForks,
    caseCount,
  })

  return fixturesRoot
}

export async function fetchAllReleaseSources(options?: {
  cacheRoot?: string
  force?: boolean
  names?: string[]
}): Promise<void> {
  const manifest = loadManifest()
  for (const [name, source] of Object.entries(manifest.sources)) {
    if (source.kind !== 'release') continue
    if (options?.names !== undefined && !options.names.includes(name)) continue
    await fetchRelease(name, source, options)
  }
}

type GitHubAsset = { name: string; size: number; digest?: string; browser_download_url: string }

export async function updateManifestEntry(sourceName: string, tag: string): Promise<void> {
  const manifest = loadManifest()
  const source = manifest.sources[sourceName]
  if (source === undefined || source.kind !== 'release') {
    throw new Error(`Cannot update non-release source ${sourceName}`)
  }
  const repo = source.repo
  const encodedTag = encodeURIComponent(tag)
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${encodedTag}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'ethereumjs-fixture-fetch' },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status} for tag ${tag}`)
  const body = (await res.json()) as { assets: GitHubAsset[] }
  const asset = body.assets.find((a) => a.name === source.asset)
  if (asset === undefined) {
    throw new Error(`Asset ${source.asset} not found on release ${tag}`)
  }
  const digest = asset.digest?.replace(/^sha256:/, '') ?? source.sha256
  const updated: ReleaseSource = {
    ...source,
    tag,
    url: asset.browser_download_url,
    sha256: digest,
    size: asset.size,
  }
  manifest.sources[sourceName] = updated
  fs.writeFileSync(manifestPath(), `${JSON.stringify(manifest, null, 2)}\n`)
  process.stderr.write(`Updated ${sourceName} → ${tag} in ${manifestPath()}\n`)
}

export function writeManifest(manifest: FixturesManifest): void {
  fs.writeFileSync(manifestPath(), `${JSON.stringify(manifest, null, 2)}\n`)
}

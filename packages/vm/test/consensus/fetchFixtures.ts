import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'

import { RECENT_FORKS } from './forks.ts'
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
  extractedForkRoot,
  forkCompleteMarker,
  forkTreeReady,
  getReleaseSource,
  loadManifestForSource,
  manifestPathForSource,
  releaseCacheDir,
  tarballCompleteMarker,
} from './manifest.ts'

export type CompleteRecord = {
  releaseSha256: string
  extractForks?: string[]
  caseCount?: number
  fork?: string
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
  forkSet: Set<string>,
  destRoot: string,
): Promise<{ caseCount: number }> {
  if (forkSet.size === 0) {
    throw new Error('extractForkSubset: fork set is empty')
  }

  const baseDir = path.dirname(path.dirname(destRoot))
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
    `Extracting ${cases.length} cases (${members.length - 1} JSON files) for ${[...forkSet].join(', ')}…\n`,
  )
  await runTarExtractFromList(archivePath, tmpExtract, listPath)
  fs.unlinkSync(listPath)
  fs.rmSync(indexStage, { recursive: true, force: true })

  const filteredIndex = buildFilteredIndex(index, cases)
  const metaDir = path.join(tmpExtract, 'fixtures', '.meta')
  fs.mkdirSync(metaDir, { recursive: true })
  fs.writeFileSync(path.join(metaDir, 'index.json'), `${JSON.stringify(filteredIndex, null, 2)}\n`)

  if (fs.existsSync(destRoot)) fs.rmSync(destRoot, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(destRoot), { recursive: true })
  fs.renameSync(path.join(tmpExtract, 'fixtures'), destRoot)
  fs.rmSync(tmpExtract, { recursive: true, force: true })

  return { caseCount: cases.length }
}

async function ensureTarball(
  sourceName: string,
  source: ReleaseSource,
  baseDir: string,
  force?: boolean,
): Promise<string> {
  fs.mkdirSync(baseDir, { recursive: true })
  const archivePath = path.join(baseDir, source.asset)
  const marker = tarballCompleteMarker(baseDir)

  if (force !== true && fs.existsSync(marker)) {
    const recorded = readCompleteRecord(marker)
    if (recorded?.releaseSha256 === source.sha256 && fs.existsSync(archivePath)) {
      return archivePath
    }
  }

  if (!fs.existsSync(archivePath) || force === true) {
    process.stderr.write(`Downloading ${source.tag} (${source.asset})…\n`)
    await download(source.url, archivePath, source.size)
  }

  const digest = await sha256File(archivePath)
  if (digest !== source.sha256) {
    throw new Error(
      `SHA256 mismatch for ${source.tag}: expected ${source.sha256}, got ${digest}. Re-download or bump manifest.`,
    )
  }

  writeCompleteRecord(marker, { releaseSha256: source.sha256 })
  return archivePath
}

export async function fetchForkExtract(
  sourceName: string,
  fork: string,
  options?: { cacheRoot?: string; force?: boolean },
): Promise<string> {
  const source = getReleaseSource(sourceName)
  const cacheRoot = options?.cacheRoot ?? defaultCacheRoot()
  const baseDir = releaseCacheDir(sourceName, source.tag, cacheRoot)
  const forkRoot = extractedForkRoot(sourceName, source.tag, fork, cacheRoot)
  const completeMarker = forkCompleteMarker(forkRoot)

  if (options?.force !== true && fs.existsSync(completeMarker)) {
    const recorded = readCompleteRecord(completeMarker)
    if (recorded?.releaseSha256 === source.sha256 && forkTreeReady(forkRoot)) {
      return forkRoot
    }
  }

  const archivePath = await ensureTarball(sourceName, source, baseDir, options?.force)
  const { caseCount } = await extractForkSubset(archivePath, source, new Set([fork]), forkRoot)

  writeCompleteRecord(completeMarker, {
    releaseSha256: source.sha256,
    fork,
    caseCount,
  })

  return forkRoot
}

export async function fetchTarballOnly(
  sourceName: string,
  options?: { cacheRoot?: string; force?: boolean },
): Promise<string> {
  const source = getReleaseSource(sourceName)
  const cacheRoot = options?.cacheRoot ?? defaultCacheRoot()
  const baseDir = releaseCacheDir(sourceName, source.tag, cacheRoot)
  await ensureTarball(sourceName, source, baseDir, options?.force)
  return baseDir
}

async function fetchFullExtract(
  source: ReleaseSource,
  baseDir: string,
  archivePath: string,
): Promise<string> {
  const fixturesRoot = path.join(baseDir, 'extracted')
  const completeMarker = path.join(baseDir, '.complete')

  const tmpExtract = path.join(baseDir, 'extract-tmp')
  if (fs.existsSync(tmpExtract)) fs.rmSync(tmpExtract, { recursive: true, force: true })
  fs.mkdirSync(tmpExtract, { recursive: true })

  process.stderr.write(`Extracting ${source.extractPaths.join(', ')}…\n`)
  await runTarExtract(archivePath, tmpExtract, source.extractPaths)

  const finalExtracted = path.join(baseDir, 'extracted')
  if (fs.existsSync(finalExtracted)) fs.rmSync(finalExtracted, { recursive: true, force: true })
  fs.renameSync(path.join(tmpExtract, 'fixtures'), finalExtracted)
  fs.rmSync(tmpExtract, { recursive: true, force: true })

  writeCompleteRecord(completeMarker, { releaseSha256: source.sha256 })

  return finalExtracted
}

export async function fetchReleaseSource(
  sourceName: string,
  options?: {
    cacheRoot?: string
    force?: boolean
    fork?: string
    tarballOnly?: boolean
    warmRecent?: boolean
    fullExtract?: boolean
  },
): Promise<string> {
  const source = getReleaseSource(sourceName)
  const cacheRoot = options?.cacheRoot ?? defaultCacheRoot()
  const baseDir = releaseCacheDir(sourceName, source.tag, cacheRoot)

  if (options?.fork !== undefined) {
    return fetchForkExtract(sourceName, options.fork, options)
  }

  if (options?.tarballOnly === true) {
    await fetchTarballOnly(sourceName, options)
    return baseDir
  }

  if (options?.warmRecent === true && sourceName === 'tests') {
    await fetchTarballOnly(sourceName, options)
    for (const fork of RECENT_FORKS) {
      await fetchForkExtract(sourceName, fork, options)
    }
    return extractedFixturesRoot(sourceName, source.tag, cacheRoot)
  }

  const fixturesRoot = extractedFixturesRoot(sourceName, source.tag, cacheRoot)
  const completeMarker = path.join(baseDir, '.complete')
  if (options?.force !== true && fs.existsSync(completeMarker)) {
    const recorded = readCompleteRecord(completeMarker)
    if (recorded?.releaseSha256 === source.sha256 && forkTreeReady(fixturesRoot)) {
      return fixturesRoot
    }
  }

  if (
    source.defaultForks !== undefined &&
    source.defaultForks.length > 0 &&
    options?.fullExtract !== true
  ) {
    await fetchTarballOnly(sourceName, options)
    for (const fork of source.defaultForks) {
      await fetchForkExtract(sourceName, fork, options)
    }
    return fixturesRoot
  }

  const archivePath = await ensureTarball(sourceName, source, baseDir, options?.force)
  return fetchFullExtract(source, baseDir, archivePath)
}

export async function fetchAllReleaseSources(options?: {
  cacheRoot?: string
  force?: boolean
  names?: string[]
  fork?: string
  tarballOnly?: boolean
  warmRecent?: boolean
  fullExtract?: boolean
}): Promise<void> {
  const names = options?.names ?? ['tests']
  for (const name of names) {
    const manifest = loadManifestForSource(name)
    const source = manifest.sources[name]
    if (source?.kind !== 'release') continue
    await fetchReleaseSource(name, options)
  }
}

type GitHubAsset = { name: string; size: number; digest?: string; browser_download_url: string }

export async function updateManifestEntry(sourceName: string, tag: string): Promise<void> {
  const manifestPath = manifestPathForSource(sourceName)
  const manifest = loadManifestForSource(sourceName)
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
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  process.stderr.write(`Updated ${sourceName} → ${tag} in ${manifestPath}\n`)
}

export function writeManifest(manifest: FixturesManifest, manifestPath: string): void {
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

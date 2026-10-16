#!/usr/bin/env node
/**
 * Download consensus EST failure artifacts from a GitHub Actions run, merge, print for agents.
 *
 * Usage (from packages/vm):
 *   npm run consensus:fetch-ci-failures
 *   npm run consensus:fetch-ci-failures -- --run-id 123456789
 */
import { execFileSync, execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  CI_FAILURE_ARTIFACT_PREFIXES,
  mergeFailureReports,
  writeFailuresDocument,
} from '../mergeReports.ts'

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

function gh(args: string[]): string {
  return execFileSync('gh', args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
}

function parseArgs(argv: string[]): { runId?: string; branch?: string; outPath: string } {
  let runId: string | undefined
  let branch: string | undefined
  let outPath = path.join(pkgRoot, '.ci', 'consensus-failures.json')

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--run-id' && argv[i + 1] !== undefined) {
      runId = argv[++i]
    } else if (a === '--branch' && argv[i + 1] !== undefined) {
      branch = argv[++i]
    } else if (a === '--out' && argv[i + 1] !== undefined) {
      const next = argv[++i]!
      outPath = path.isAbsolute(next) ? next : path.resolve(pkgRoot, next)
    }
  }
  return { runId, branch, outPath }
}

function resolveBranch(explicit?: string): string {
  if (explicit !== undefined) return explicit
  return execSync('git branch --show-current', { encoding: 'utf8' }).trim()
}

function resolveRunId(branch: string, explicit?: string): string {
  if (explicit !== undefined) return explicit
  const json = gh([
    'run',
    'list',
    '--workflow=build.yml',
    `--branch=${branch}`,
    '--limit=15',
    '--json',
    'databaseId,conclusion,status',
  ])
  const runs = JSON.parse(json) as {
    databaseId: number
    conclusion: string | null
    status: string
  }[]
  const failed = runs.find((r) => r.status === 'completed' && r.conclusion === 'failure')
  if (failed !== undefined) return String(failed.databaseId)
  const latest = runs.find((r) => r.status === 'completed')
  if (latest !== undefined) return String(latest.databaseId)
  throw new Error(`No completed Build workflow run found for branch ${branch}`)
}

function listFailureArtifactNames(runId: string): string[] {
  const repo = gh(['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'])
  const json = gh(['api', `repos/${repo}/actions/runs/${runId}/artifacts`])
  const artifacts = JSON.parse(json) as { artifacts?: { name: string }[] }
  const list = artifacts.artifacts ?? []
  return list
    .map((a) => a.name)
    .filter((name) => CI_FAILURE_ARTIFACT_PREFIXES.some((prefix) => name.startsWith(`${prefix}-`)))
}

function reportFileInArtifact(dir: string): string | undefined {
  for (const file of ['consensus-est-failures.json', 'consensus-bogota-failures.json']) {
    const p = path.join(dir, file)
    if (fs.existsSync(p)) return p
  }
  return undefined
}

function main(): void {
  const { runId: runIdArg, branch: branchArg, outPath } = parseArgs(process.argv.slice(2))
  const branch = resolveBranch(branchArg)
  const runId = resolveRunId(branch, runIdArg)

  const artifactNames = listFailureArtifactNames(runId)
  if (artifactNames.length === 0) {
    process.stderr.write(
      `No consensus failure artifacts on run ${runId} (branch ${branch}).\n` +
        `Expected names like consensus-est-failures-<fork> or consensus-bogota-failures-<fork>.\n`,
    )
    process.exit(1)
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'est-ci-failures-'))
  const reportPaths: string[] = []

  for (const name of artifactNames) {
    const dir = path.join(tmp, name)
    fs.mkdirSync(dir, { recursive: true })
    gh(['run', 'download', runId, '--name', name, '--dir', dir])
    const report = reportFileInArtifact(dir)
    if (report !== undefined) reportPaths.push(report)
  }

  if (reportPaths.length === 0) {
    process.stderr.write(`Downloaded artifacts but no failure JSON inside.\n`)
    process.exit(1)
  }

  const merged = mergeFailureReports(reportPaths)
  writeFailuresDocument(outPath, merged)

  process.stdout.write(`CI run ${runId} · branch ${branch} · ${merged.failures.length} failure(s)\n`)
  process.stdout.write(`Merged report: ${outPath}\n\n`)

  for (const f of merged.failures) {
    const loc = f.relPath ?? f.filePath
    const err = f.error?.split('\n')[0] ?? ''
    process.stdout.write(`  ${f.fork}\t${f.format}\t${f.id}\t${loc}\n    ${err}\n`)
  }

  process.stdout.write(
    `\nRerun one fork locally (match the CI job name):\n` +
      `  npm run test:consensus -- --source tests --fork <Fork> --rerun-failed ${outPath} --jobs 4 --skip-fetch\n`,
  )
}

main()

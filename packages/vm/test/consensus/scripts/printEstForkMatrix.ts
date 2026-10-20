#!/usr/bin/env node
/** Prints fixtures.json `runnableForks` as JSON for a GitHub Actions matrix. */
import { loadAllEstForks } from '../forks.ts'

process.stdout.write(`${JSON.stringify([...loadAllEstForks()])}\n`)

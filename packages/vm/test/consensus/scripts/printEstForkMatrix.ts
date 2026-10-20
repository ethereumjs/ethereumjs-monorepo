#!/usr/bin/env node
/** Prints ALL_EST_FORKS as JSON for a GitHub Actions matrix. */
import { ALL_EST_FORKS } from '../forks.ts'

process.stdout.write(`${JSON.stringify([...ALL_EST_FORKS])}\n`)

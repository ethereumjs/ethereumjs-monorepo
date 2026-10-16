#!/usr/bin/env node
/** Prints ALL_EST_FORKS as JSON for GitHub Actions matrix (fromJson). */
import { ALL_EST_FORKS } from '../forks.ts'

process.stdout.write(`${JSON.stringify([...ALL_EST_FORKS])}\n`)

/**
 * This file is deprecated (helper for old test runner).
 *
 * The new runners in executionSpec*.test.ts will become the main
 * entry point for test running.
 *
 * If you discover functionality here which is still missing in the new runner,
 * please open a PR against executionSpecState.test.ts.
 *
 * PLEASE DO NOT COPY LARGER PARTS OF THE CODE TO THE NEW RUNNER BUT RE-IMPLEMENT
 * (USE COMMON SENSE).
 */
import { runLegacyVitest } from './util/legacyVitestPool.ts'

await runLegacyVitest('state')

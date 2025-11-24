import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))
const env = { ...process.env }

const setEnv = (key: string, value: unknown) => {
  if (value !== undefined) {
    env[key] = String(value)
  }
}

// Map CLI args to VITE_* env vars
setEnv('VITE_FORK', argv.fork ?? env.VITE_FORK ?? 'Prague')
setEnv('VITE_FILE', argv.file)
setEnv('VITE_DIR', argv.dir)
setEnv('VITE_EXCLUDE_DIR', argv.excludeDir)
setEnv('VITE_TESTS_PATH', argv.testsPath)
setEnv('VITE_CUSTOM_TESTS_PATH', argv.customTestsPath)
setEnv('VITE_DIRECTORY', argv.directory)
setEnv('VITE_SKIP', argv.skip)
setEnv('VITE_SKIP_TESTS', argv.skipTests)
setEnv('VITE_RUN_SKIPPED', argv.runSkipped)
setEnv('VITE_BLS', argv.bls)
setEnv('VITE_BN254', argv.bn254)
setEnv('VITE_STATE_MANAGER', argv.stateManager)
setEnv('VITE_FORK_CONFIG', argv.forkConfig)
setEnv('VITE_VERIFY_TEST_AMOUNT_ALL_TESTS', argv['verify-test-amount-alltests'])
setEnv('VITE_EXPECTED_TEST_AMOUNT', argv['expected-test-amount'])

if (argv.dist === true) setEnv('VITE_DIST', 'true')
if (argv.debug === true) setEnv('VITE_DEBUG', 'true')
if (argv.profile === true) setEnv('VITE_PROFILE', 'true')

const packageRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

const vitest = spawn('npx', ['vitest', 'test/tester/blockchain.spec.ts'], {
  cwd: packageRoot,
  env,
  stdio: 'inherit',
  shell: true,
})

vitest.on('close', (code) => {
  process.exit(code ?? 0)
})

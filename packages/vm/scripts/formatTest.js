const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const testScript = process.argv.find((arg, i, array) => array[i - 1] === '-t')
const formatter = process.argv.find((arg, i, array) => array[i - 1] === '-with')

runTestsWithFormatter(testScript, formatter)

function runTestsWithFormatter (testScript, formatter) {
  if (!testScript) {
    console.log('No test script specified!')
    return
  }

  const packageJson = fs.readFileSync(path.dirname(__dirname) + '/package.json', 'utf8')
  const parsedPackageJson = JSON.parse(packageJson)
  const npmTestScriptNames = Object.keys(parsedPackageJson.scripts)

  const withFormatter = formatter ? ` | ${formatter}` : ''

  const commandToRun = npmTestScriptNames.find(name => name === testScript)
    ? `npm run ${testScript}${withFormatter}`
    : `node ${testScript}${withFormatter}`

  const child = spawn('sh', ['-c', commandToRun])

  child.stdout.on('data', (data) => {
    process.stdout.write(data)
  })

  child.stderr.on('data', (data) => {
    process.stdout.write(data)
  })

  child.on('exit', (data) => {
    process.stdout.write('Done')
  })
}

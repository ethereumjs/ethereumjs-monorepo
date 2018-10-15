const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const testScript = process.argv.find((arg, i, array) => array[i - 1] === '-t')
const formatter = process.argv.find((arg, i, array) => array[i - 1] === '-with')

runTestsWithFormatter(testScript, formatter)

function runTestsWithFormatter (testScript, formatter = './node_modules/.bin/tap-spec') {
  if (!testScript) {
    console.log('No test script specified!')
    return
  }

  const packageJson = fs.readFileSync(path.dirname(__dirname) + '/package.json', 'utf8')
  const parsedPackageJson = JSON.parse(packageJson)
  const npmTestScriptNames = Object.keys(parsedPackageJson.scripts)

  const commandToRun = npmTestScriptNames.find(name => name === testScript)
    ? `npm run ${testScript}`
    : `node ${testScript}`

  const child = spawn('sh', ['-c', `${commandToRun} | ${formatter}`])

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

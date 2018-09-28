const { spawn } = require('child_process')

const testScript = process.argv.find((arg, i, array) => array[i - 1] === '-t')
const formatter = process.argv.find((arg, i, array) => array[i - 1] === '-with')

runTestsWithFormatter(testScript, formatter)

function runTestsWithFormatter (testScript, formatter = './node_modules/.bin/tap-spec') {
  if (!testScript) {
    console.log('No test script specified!')
    return
  }

  const npmTestScriptNames = [
    'coverageTests',
    'testVM',
    'testStateByzantium',
    'testStateConstantinople',
    'testBuildIntegrity',
    'testBlockchain',
    'testBlockchainGeneralStateTests',
    'testBlockchainBlockGasLimit',
    'testBlockchainValid',
    'testBlockchainTotalDifficulty',
    'testAPI',
    'test'
  ]

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

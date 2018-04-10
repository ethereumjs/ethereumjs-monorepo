var parser = require('yargs')
  .option('networkid', {
    describe: 'Network ID (1=Mainnet, 3=Ropsten)',
    choices: [1, 3]
  })
  .locale('en_EN')
  .argv

module.exports = parser

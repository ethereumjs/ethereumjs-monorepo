const moduleList = ['eth', 'web3', 'net']

moduleList.forEach(mod => {
  module.exports[mod] = require(`./${mod}`)
})

module.exports.list = moduleList

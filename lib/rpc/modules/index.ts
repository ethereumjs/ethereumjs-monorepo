const moduleList = ['eth', 'web3', 'net']

moduleList.forEach((mod: string) => {
  module.exports[mod] = require(`./${mod}`)
})

module.exports.list = moduleList
export = module.exports

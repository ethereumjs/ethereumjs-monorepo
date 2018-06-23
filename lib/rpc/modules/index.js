const moduleList = ['eth']

moduleList.forEach(mod => {
  module.exports[mod] = require(`./${mod}`)
})

module.exports.list = moduleList

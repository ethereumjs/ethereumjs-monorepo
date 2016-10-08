const esModules = [
  'rlp-encoding'
]

const nodeModulesPath = require('path').join(__dirname, 'node_modules')
const esModulesRegExp = new RegExp(esModules.join('|'))

require('babel-register')({
  ignore: (path) => {
    if (path.indexOf(nodeModulesPath) !== 0) return false
    return path.slice(nodeModulesPath.length).match(esModulesRegExp) === null
  }
})

require('require-extensions-order').setIndex('.es', 0)

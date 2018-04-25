const hardforkChanges = {
  'chainstart': require('./chainstart.json'),
  'homestead': require('./homestead.json'),
  'dao': require('./dao.json'),
  'tangerineWhistle': require('./tangerineWhistle.json'),
  'spuriousDragon': require('./spuriousDragon.json'),
  'byzantium': require('./byzantium.json'),
  'constantinople': require('./constantinople.json'),
  'casper': require('./casper.json')
}

function _getLatestHardfork () {
  let latestHardfork
  for (let hf in hardforkChanges) {
    if (hardforkChanges[hf].isActive) {
      latestHardfork = hf
    }
  }
  return latestHardfork
}

function _byTopic (topic, name, hardfork) {
  let value
  for (let hf in hardforkChanges) {
    if (!hardforkChanges[hf][topic]) {
      throw new Error(`Topic ${topic} not defined`)
    }
    if (hardforkChanges[hf][topic][name] !== undefined) {
      value = hardforkChanges[hf][topic][name].v
    }
    if (hf === hardfork) break
  }
  if (value === undefined) {
    throw new Error(`${topic} value for ${name} not found`)
  }
  return value
}

let params = {}
params.latestHardfork = _getLatestHardfork()

params.gasConfig = function (name, hardfork) {
  return _byTopic('gasConfig', name, hardfork)
}

params.latestGasConfig = function (name) {
  return module.exports.gasConfig(name, module.exports.latestHardfork)
}

params.gasPrices = function (name, hardfork) {
  return _byTopic('gasPrices', name, hardfork)
}

params.latestGasPrices = function (name) {
  return module.exports.gasPrices(name, module.exports.latestHardfork)
}

params.vm = function (name, hardfork) {
  return _byTopic('vm', name, hardfork)
}

params.latestVm = function (name) {
  return module.exports.vm(name, module.exports.latestHardfork)
}

params.pow = function (name, hardfork) {
  return _byTopic('pow', name, hardfork)
}

params.latestPow = function (name) {
  return module.exports.pow(name, module.exports.latestHardfork)
}

params.casper = function (name, hardfork) {
  return _byTopic('casper', name, hardfork)
}

params.latestCasper = function (name) {
  return module.exports.casper(name, module.exports.latestHardfork)
}

params.sharding = function (name, hardfork) {
  return _byTopic('sharding', name, hardfork)
}

params.latestSharding = function (name) {
  return module.exports.sharding(name, module.exports.latestHardfork)
}

module.exports = params

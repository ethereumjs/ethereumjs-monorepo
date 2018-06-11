const modules = require('./modules')

class RPCServer {
  constructor (chain) {
    this._chain = chain
    this._modules = {}

    // should be 'Eth', 'EVM', etc.
    const moduleList = ['Eth']
    moduleList.forEach(moduleName => {
      this._modules[moduleName.toLowerCase()] = new modules[moduleName](this._chain)
    })
  }

  execute (req, cb) {
    const [moduleName, methodName] = req.method.split('_')
    this._modules[moduleName][methodName](req.params, cb)
  }
}

module.exports = RPCServer

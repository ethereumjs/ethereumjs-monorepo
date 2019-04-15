const promisify = require('util.promisify')

module.exports = class PStateManager {
  constructor (wrapped) {
    this._wrapped = wrapped
  }

  copy () {
    return new PStateManager(this._wrapped.copy())
  }

  getAccount (addr) {
    return promisify(this._wrapped.getAccount.bind(this._wrapped))(addr)
  }

  putAccount (addr, account) {
    return promisify(this._wrapped.putAccount.bind(this._wrapped))(addr, account)
  }

  putContractCode (addr, code) {
    return promisify(this._wrapped.putContractCode.bind(this._wrapped))(addr, code)
  }

  getContractCode (addr) {
    return promisify(this._wrapped.getContractCode.bind(this._wrapped))(addr)
  }

  getContractStorage (addr, key) {
    return promisify(this._wrapped.getContractStorage.bind(this._wrapped))(addr, key)
  }

  putContractStorage (addr, key, value) {
    return promisify(this._wrapped.putContractStorage.bind(this._wrapped))(addr, key, value)
  }

  clearContractStorage (addr) {
    return promisify(this._wrapped.clearContractStorage.bind(this._wrapped))(addr)
  }

  checkpoint () {
    return promisify(this._wrapped.checkpoint.bind(this._wrapped))()
  }

  commit () {
    return promisify(this._wrapped.commit.bind(this._wrapped))()
  }

  revert () {
    return promisify(this._wrapped.revert.bind(this._wrapped))()
  }

  getStateRoot () {
    return promisify(this._wrapped.getStateRoot.bind(this._wrapped))()
  }

  setStateRoot (root) {
    return promisify(this._wrapped.setStateRoot.bind(this._wrapped))(root)
  }

  dumpStorage (address) {
    return promisify(this._wrapped.dumpStorage.bind(this._wrapped))(address)
  }

  hasGenesisState () {
    return promisify(this._wrapped.hasGenesisState.bind(this._wrapped))()
  }

  generateCanonicalGenesis () {
    return promisify(this._wrapped.generateCanonicalGenesis.bind(this._wrapped))()
  }

  generateGenesis (initState) {
    return promisify(this._wrapped.generateGenesis.bind(this._wrapped))(initState)
  }

  accountIsEmpty (address) {
    return promisify(this._wrapped.accountIsEmpty.bind(this._wrapped))(address)
  }

  cleanupTouchedAccounts () {
    return promisify(this._wrapped.cleanupTouchedAccounts.bind(this._wrapped))()
  }
}

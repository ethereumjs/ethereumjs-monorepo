const jayson = require('jayson')

const Manager = require('../../lib/rpc')
const Logger = require('../../lib/logging')

const config = { loglevel: 'error' }
config.logger = Logger.getLogger(config)
module.exports = {
  startRPC (methods, port = 3000) {
    const server = jayson.server(methods)
    const httpServer = server.http()
    httpServer.listen(port)
    return httpServer
  },

  closeRPC (server) {
    server.close()
  },

  createManager (node) {
    return new Manager(node, config)
  }
}

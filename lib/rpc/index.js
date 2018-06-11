const http = require('http')
const RPCManager = require('./rpc-manager')

class RPCServer {
  constructor (chain) {
    this._manager = new RPCManager(chain)
    this._server = http.createServer(this._requestHandler.bind(this))
  }

  listen (port) {
    this._server.listen(port)
  }

  _requestHandler (req, res) {
    let body = []
    req.on('data', chunk => body.push(chunk))
    req.on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString())
      this._manager.execute(body, (err, result) => {
        let response = result
        let code = 200

        if (err) {
          code = 406
          response = { code, message: err.message }
        }

        res.writeHead(code, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response))
      })
    })
  }
}

module.exports = RPCServer

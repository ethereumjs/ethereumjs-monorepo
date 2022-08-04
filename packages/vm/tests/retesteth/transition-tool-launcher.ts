const ipc = require('node-ipc').default

const connectionName = 'transition-tool-cluster'

ipc.config.retry = 1500
ipc.config.silent = true

ipc.connectTo(connectionName, () => {
  ipc.of[connectionName].on('connect', () => {
    if (process.argv[2] === 'KILL') {
      ipc.of[connectionName].emit('message', 'KILL')
    } else {
      ipc.of[connectionName].emit('message', process.argv)
    }
  })
  ipc.of[connectionName].on('message', (message: any) => {
    if (message === 'KILL') {
      ipc.disconnect(connectionName)
    }
  })
})

import { resolve } from 'path'
const ipc = require('node-ipc').default

const fork = require('child_process').fork

ipc.config.id = 'transition-tool-cluster'
ipc.config.retry = 1500
ipc.config.silent = true

const program = resolve('transition-child.ts')
const parameters: any = []
const options = {
  //stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  execArgv: ['-r', 'ts-node/register'],
}

const children: any = []

function getChild() {
  let index = -1
  for (let i = 0; i < children.length; i++) {
    if (children[i].active === false) {
      index = i
      break
    }
  }
  if (index === -1) {
    const child = fork(program, parameters, options)
    child.on('error', console.log)
    const newChild = {
      active: false,
      child,
    }
    children.push(newChild)
    return newChild
  }
  return children[index]
}

ipc.serve(() => {
  ipc.server.on('message', (message: any, socket: any) => {
    const childObject = getChild()

    childObject.active = true
    const child = childObject.child

    child.send(message)

    child.on('message', (_childMessage: any) => {
      childObject.active = false
      ipc.server.emit(socket, 'message', 'KILL')
    })
  })
  console.log('Transition cluster ready')
})
ipc.server.start()

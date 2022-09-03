import { resolve } from 'path'

const fork = require('child_process').fork
const http = require('http')

const program = resolve('tests/retesteth/transition-child.ts')
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

function runTest(message: any) {
  return new Promise((resolve) => {
    const childObject = getChild()

    childObject.active = true
    const child = childObject.child

    child.send(message)

    child.on('message', (_childMessage: any) => {
      childObject.active = false
      resolve(undefined)
    })
  })
}

const server = http.createServer((request: any, result: any) => {
  if (request.method === 'POST') {
    let message = ''
    request.on('data', (data: any) => {
      message += data.toString()
    })
    request.on('end', async () => {
      await runTest(message)
      result.end()
    })
  }
})
server.listen(3000)
console.log('Transition cluster ready')

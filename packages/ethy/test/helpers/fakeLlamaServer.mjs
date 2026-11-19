#!/usr/bin/env node
import http from 'node:http'
import process from 'node:process'

let port = 18_080
const args = process.argv
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1] !== undefined) {
    port = Number.parseInt(args[i + 1], 10)
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`)
  if (url.pathname === '/health') {
    res.writeHead(200)
    res.end('ok')
    return
  }
  if (url.pathname === '/v1/models') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ data: [{ id: 'fake' }] }))
    return
  }
  if (req.method === 'POST' && url.pathname === '/v1/chat/completions') {
    let raw = ''
    req.on('data', (c) => {
      raw += c
    })
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  mode: 'dispatch',
                  category: 'watch',
                  severity: 'calm',
                  headline: 'Quiet chain',
                  body: 'No ranked signals in the digest.',
                }),
              },
            },
          ],
        }),
      )
    })
    return
  }
  res.writeHead(404)
  res.end()
})

server.listen(port, '127.0.0.1')
process.on('SIGTERM', () => {
  server.close(() => process.exit(0))
})
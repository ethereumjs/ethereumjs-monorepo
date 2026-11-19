import * as http from 'node:http'

export type MockChatScript = (body: unknown) => string

export type MockLlmServer = {
  baseUrl: string
  ollamaBaseUrl: string
  requests: unknown[]
  close(): Promise<void>
}

export async function startMockLlmServer(script: MockChatScript): Promise<MockLlmServer> {
  const requests: unknown[] = []
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    if (url.pathname === '/health') {
      res.writeHead(200)
      res.end('ok')
      return
    }
    if (url.pathname === '/v1/models') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ data: [{ id: 'mock' }] }))
      return
    }
    if (url.pathname === '/api/tags') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ models: [{ name: 'qwen3.5:2b' }] }))
      return
    }
    if (
      req.method === 'POST' &&
      (url.pathname === '/v1/chat/completions' || url.pathname === '/api/chat')
    ) {
      const chunks: Buffer[] = []
      req.on('data', (c) => chunks.push(c))
      req.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8')
        const body = JSON.parse(raw) as unknown
        requests.push(body)
        const text = script(body)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        if (url.pathname === '/api/chat') {
          res.end(JSON.stringify({ message: { content: text } }))
        } else {
          res.end(JSON.stringify({ choices: [{ message: { content: text } }] }))
        }
      })
      return
    }
    res.writeHead(404)
    res.end()
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()))
  const addr = server.address()
  const port = typeof addr === 'object' && addr !== null ? addr.port : 0
  const baseUrl = `http://127.0.0.1:${port}`
  return {
    baseUrl,
    ollamaBaseUrl: baseUrl,
    requests,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((err) => (err !== undefined ? reject(err) : resolve()))
      }),
  }
}

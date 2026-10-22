import { connect } from 'node:net'

/** Send one JSON line to a lab control socket; return the first response line. */
export function socketCommand(sockPath: string, payload: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = connect(sockPath)
    let out = ''
    conn.setEncoding('utf8')
    conn.on('error', reject)
    conn.on('data', (d) => {
      out += d
      if (out.includes('\n')) {
        conn.end()
        resolve(out.trim())
      }
    })
    conn.write(`${payload}\n`)
  })
}

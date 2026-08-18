import { MapDB, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const db = new MapDB<string, Uint8Array>()
  const key = 'state-key'
  const value = hexToBytes('0xdeadbeef')

  await db.put(key, value)
  const read = await db.get(key)

  console.log(`Stored and read back ${read?.length} bytes`)
}

void main()

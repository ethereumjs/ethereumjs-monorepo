import Benchmark from 'benchmark'
import { encode, decode } from '../dist/cjs/index.js'

const suite = new Benchmark.Suite()

const buf = (length: number, start = 0) =>
  Uint8Array.from(Array.from({ length }, (_, i) => start + i))

const testData = [
  { type: 'list of small numbers', data: Array.from({ length: 128 }, (_, i) => 1024 + i) },
  { type: 'list of large numbers', data: Array.from({ length: 128 }, (_, i) => 1099511627776 + i) },
  { type: 'list of small buffers', data: Array.from({ length: 128 }, (_, i) => buf(32, i)) },
  { type: 'list of large buffers', data: Array.from({ length: 128 }, (_, i) => buf(1048576, i)) },
]

for (const { type, data } of testData) {
  const encoded = encode(data)
  suite.add(`encode - ${type}`, () => encode(data))
  suite.add(`decode - ${type}`, () => decode(encoded))
}

suite.on('cycle', (event: Event) => console.log(String(event.target))).run()

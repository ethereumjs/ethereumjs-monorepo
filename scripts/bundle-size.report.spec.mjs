import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { generateMarkdownReport } from './bundle-size.mjs'

describe('generateMarkdownReport', () => {
  it('compact one-liner when all packages unchanged', () => {
    const sizes = { rlp: 8000, vm: 500_000, evm: 57_000 }
    const report = generateMarkdownReport(sizes, { ...sizes })
    assert.match(report, /Unchanged vs baseline/)
    assert.match(report, /3 packages checked/)
    assert.doesNotMatch(report, /^\| Package \|/m)
  })

  it('table lists only changed packages', () => {
    const baseline = { rlp: 10_000, vm: 500_000 }
    const current = { rlp: 10_000, vm: 510_000 }
    const report = generateMarkdownReport(current, baseline)
    assert.match(report, /\*\*1\*\* of \*\*2\*\* packages changed/)
    const mainSection = report.split('<details>')[0]
    assert.match(mainSection, /`vm`/)
    assert.doesNotMatch(mainSection, /`rlp`/)
  })

  it('includes collapsible full list when some packages unchanged', () => {
    const baseline = { a: 1000, b: 2000, c: 3000 }
    const current = { a: 1000, b: 2500, c: 3000 }
    const report = generateMarkdownReport(current, baseline)
    assert.match(report, /<details>/)
    assert.match(report, /`a`/)
    assert.match(report, /`c`/)
  })
})

const tape = require('tape')
const fs = require('fs')

const util = require('../../../benchmarks/util')

const BLOCK_FIXTURE = '../../../benchmarks/fixture/blocks-prestate.json'


tape('MPT', t => {
    t.test('should not throw', async st => {
        let data = JSON.parse(fs.readFileSync(BLOCK_FIXTURE, 'utf8'))
        if (!Array.isArray(data)) data = [data]
        console.log(`Total number of blocks in data set: ${data.length}`)

        data = data[0]
        const stateManager = await util.getPreState(data.preState)
        const address = Buffer.from('a5d7d68d7975e89feb240f42fed1d77bb71b1caf', 'hex')
        const slot = Buffer.from('9267d898f406d2d0c108c7933c558e54642b0b339379caa2fe77a4f8be716a53', 'hex')
        const value = Buffer.from(('00').repeat(31) + '01', 'hex')
        await stateManager.putContractStorage(address, slot, value)
    })
})
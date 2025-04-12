import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { eip4844GethGenesis } from '@ethereumjs/testdata'
import { Config } from '../src/config.ts'
import { createInlineClient } from '../src/util/inclineClient.ts'

const main = async () => {
  const client = await createInlineClient(
    new Config({}),
    <any>createCommonFromGethGenesis(eip4844GethGenesis, {}),
    {},
    undefined,
    true,
  )
  await client.start()
  await client.stop()
  console.log('exit')
  process.exit(0)
}

main()

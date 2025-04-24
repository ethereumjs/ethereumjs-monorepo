import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { eip4844GethGenesis } from '@ethereumjs/testdata'
import { Config } from '../src/config.ts'
import { createInlineClient } from '../src/util/inclineClient.ts'

// This script imports `createInlineClient` which in turn loads all of our our libraries and will trigger the UNSUPPORTED_TYPESCRIPT_SYNTAX error when
// we run `node --conditions=typescript --experimental-strip-types examples/inlineClient.ts` if there is unerasable syntax (e.g. <SomeType>someVar)

const main = async () => {
  const common = createCommonFromGethGenesis(eip4844GethGenesis, {})
  const config = new Config({ common })
  const client = await createInlineClient(config, common, {}, undefined, true)

  console.log(`client is started: ${client.started}`)
  await client.stop()
}

void main()

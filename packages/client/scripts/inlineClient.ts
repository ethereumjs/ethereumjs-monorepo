import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { eip4844GethGenesis } from '@ethereumjs/testdata'
import { Config } from '../src/config.ts'
import { createInlineClient } from '../src/util/inclineClient.ts'

// This script imports `createInlineClient` which in turn loads all of our cour libraries and will trigger the UNSUPPORTED_TYPESCRIPT_SYNTAX error when
// we run `node --conditions=typescript --experimental-strip-types examples/inlineClient.ts`
console.log('exit')

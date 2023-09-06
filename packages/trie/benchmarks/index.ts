import { createSuite } from './suite'
import { LevelDB } from './engines/level'
import { MapDB } from '@ethereumjs/util'
import { LMDB } from './engines/lmdb'

createSuite(new MapDB())
createSuite(new LevelDB())
createSuite(new LMDB())

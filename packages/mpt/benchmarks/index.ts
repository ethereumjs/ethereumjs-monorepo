import { MapDB } from '@ethereumjs/util'
import { keccak_256 as nobleKeccak } from '@noble/hashes/sha3.js'
import { keccak_256 as unrolledKeccak } from 'unrolled-nbl-hashes-sha3'
import { LevelDB } from './engines/level'
import { createSuite } from './suite'

// Run with noble keccak (baseline)
createSuite(new MapDB(), nobleKeccak, '[noble] ')
createSuite(new LevelDB(), nobleKeccak, '[noble] ')

// Run with unrolled keccak
createSuite(new MapDB(), unrolledKeccak, '[unrolled] ')
createSuite(new LevelDB(), unrolledKeccak, '[unrolled] ')

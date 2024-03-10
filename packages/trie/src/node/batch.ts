import {
  type BatchDBOp,
  KeyEncoding,
  bytesToUtf8,
  concatBytes,
  equalsBytes,
} from '@ethereumjs/util'

import { ROOT_DB_KEY, type TrieNode } from '../types.js'
import { bytesToNibbles, nibblesCompare } from '../util/nibbles.js'

import { BranchNode } from './branch.js'

import type { Trie } from '../trie.js'

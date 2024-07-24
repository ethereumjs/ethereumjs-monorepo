import { PutBatch, bytesToHex, concatBytes, equalsBytes } from '@ethereumjs/util'
import { Proof, TrieOpts, TrieShallowCopyOpts, verifyRangeProof } from './index.js'
import { Trie } from './trie.js'
import { bytesToNibbles } from './util/nibbles.js'

export class ProofTrie extends Trie {
  constructor(opts?: TrieOpts) {
    super(opts)
  }

  /**
   * A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
   * allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
   * of state trie data is received and validated for constructing world state, locally. Also see {@link verifyRangeProof}. A static
   * version of this function also exists.
   * @param rootHash - root hash of state trie this proof is being verified against.
   * @param firstKey - first key of range being proven.
   * @param lastKey - last key of range being proven.
   * @param keys - key list of leaf data being proven.
   * @param values - value list of leaf data being proven, one-to-one correspondence with keys.
   * @param proof - proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well
   * @returns a flag to indicate whether there exists more trie node in the trie
   */
  verifyRangeProof(
    rootHash: Uint8Array,
    firstKey: Uint8Array | null,
    lastKey: Uint8Array | null,
    keys: Uint8Array[],
    values: Uint8Array[],
    proof: Uint8Array[] | null
  ): Promise<boolean> {
    return verifyRangeProof(
      rootHash,
      firstKey && bytesToNibbles(this.appliedKey(firstKey)),
      lastKey && bytesToNibbles(this.appliedKey(lastKey)),
      keys.map((k) => this.appliedKey(k)).map(bytesToNibbles),
      values,
      proof,
      this._opts.useKeyHashingFunction
    )
  }

  /**
   * Creates a proof from a trie and key that can be verified using {@link verifyTrieProof}. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains
   * the encoded trie nodes from the root node to the leaf node storing state data. The returned proof will be in the format of an array that contains Uint8Arrays of
   * serialized branch, extension, and/or leaf nodes.
   * @param key key to create a proof for
   */
  async createProof(key: Uint8Array): Promise<Proof> {
    this.DEBUG && this.debug(`Creating Proof for Key: ${bytesToHex(key)}`, ['CREATE_PROOF'])
    const { stack } = await this.findPath(this.appliedKey(key))
    const p = stack.map((stackElem) => {
      return stackElem.serialize()
    })
    this.DEBUG && this.debug(`Proof created with (${stack.length}) nodes`, ['CREATE_PROOF'])
    return p
  }

  /**
   * Updates a trie from a proof by putting all the nodes in the proof into the trie. If a trie is being updated with multiple proofs, {@param shouldVerifyRoot} can
   * be passed as false in order to not immediately throw on an unexpected root, so that root verification can happen after all proofs and their nodes have been added.
   * An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.
   * @param proof An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof to update the trie from.
   * @param shouldVerifyRoot If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case.
   * @returns The root of the proof
   */
  async updateFromProof(proof: Proof, shouldVerifyRoot: boolean = false) {
    this.DEBUG && this.debug(`Saving (${proof.length}) proof nodes in DB`, ['FROM_PROOF'])
    const opStack = proof.map((nodeValue) => {
      let key = Uint8Array.from(this.hash(nodeValue))
      key = this._opts.keyPrefix ? concatBytes(this._opts.keyPrefix, key) : key
      return {
        type: 'put',
        key,
        value: nodeValue,
      } as PutBatch
    })

    if (shouldVerifyRoot) {
      if (opStack[0] !== undefined && opStack[0] !== null) {
        if (!equalsBytes(this.root(), opStack[0].key)) {
          throw new Error('The provided proof does not have the expected trie root')
        }
      }
    }

    await this._db.batch(opStack)
    if (opStack[0] !== undefined) {
      return opStack[0].key
    }
  }

  /**
   * Verifies a proof by putting all of its nodes into a trie and attempting to get the proven key. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof
   * contains the encoded trie nodes from the root node to the leaf node storing state data. A static version of this function exists with the same name.
   * @param rootHash Root hash of the trie that this proof was created from and is being verified for
   * @param key Key that is being verified and that the proof is created for
   * @param proof an EIP-1186 proof to verify the key against
   * @throws If proof is found to be invalid.
   * @returns The value from the key, or null if valid proof of non-existence.
   */
  async verifyProof(
    rootHash: Uint8Array,
    key: Uint8Array,
    proof: Proof
  ): Promise<Uint8Array | null> {
    this.DEBUG &&
      this.debug(
        `Verifying Proof:\n|| Key: ${bytesToHex(key)}\n|| Root: ${bytesToHex(
          rootHash
        )}\n|| Proof: (${proof.length}) nodes
      `,
        ['VERIFY_PROOF']
      )
    const proofTrie = new ProofTrie({
      root: rootHash,
      useKeyHashingFunction: this._opts.useKeyHashingFunction,
      common: this._opts.common,
    })
    try {
      await proofTrie.updateFromProof(proof, true)
    } catch (e: any) {
      throw new Error('Invalid proof nodes given')
    }
    try {
      this.DEBUG &&
        this.debug(`Verifying proof by retrieving key: ${bytesToHex(key)} from proof trie`, [
          'VERIFY_PROOF',
        ])
      const value = await proofTrie.get(this.appliedKey(key), true)
      this.DEBUG && this.debug(`PROOF VERIFIED`, ['VERIFY_PROOF'])
      return value
    } catch (err: any) {
      if (err.message === 'Missing node in DB') {
        throw new Error('Invalid proof provided')
      } else {
        throw err
      }
    }
  }

  /**
   * Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. An EIP-1186 proof contains the encoded trie nodes from the root
   * node to the leaf node storing state data. This function does not check if the proof has the same expected root. A static version of this function exists
   * with the same name.
   * @param proof an EIP-1186 proof to update the trie from
   * @deprecated Use `updateFromProof`
   */
  async fromProof(proof: Proof): Promise<void> {
    await this.updateFromProof(proof, false)

    if (equalsBytes(this.root(), this.EMPTY_TRIE_ROOT) && proof[0] !== undefined) {
      let rootKey = Uint8Array.from(this.hash(proof[0]))
      // TODO: what if we have keyPrefix and we set root? This should not work, right? (all trie nodes are non-reachable)
      rootKey = this._opts.keyPrefix ? concatBytes(this._opts.keyPrefix, rootKey) : rootKey
      this.root(rootKey)
      await this.persistRoot()
    }
    return
  }

  /**
   * Returns a copy of the underlying trie.
   *
   * Note on db: the copy will create a reference to the
   * same underlying database.
   *
   * Note on cache: for memory reasons a copy will by default
   * not recreate a new LRU cache but initialize with cache
   * being deactivated. This behavior can be overwritten by
   * explicitly setting `cacheSize` as an option on the method.
   *
   * @param includeCheckpoints - If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.
   */
  shallowCopy(includeCheckpoints = true, opts?: TrieShallowCopyOpts): ProofTrie {
    const trie = new ProofTrie({
      ...this._opts,
      db: this._db.db.shallowCopy(),
      root: this.root(),
      cacheSize: 0,
      ...(opts ?? {}),
    })
    if (includeCheckpoints && this.hasCheckpoints()) {
      trie._db.setCheckpoints(this._db.checkpoints)
    }
    return trie
  }
}

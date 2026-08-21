const REPO = 'https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages'

/** Build a link to generated TypeDoc markdown in the monorepo. */
function doc(pkg, section, name) {
  return `${REPO}/${pkg}/docs/${section}/${name}.md`
}

/**
 * Cross-package {@link} targets for per-package TypeDoc runs.
 * See DEVELOPER.md § Tooling.
 */
export const externalSymbolLinkMappings = {
  global: {
    bigint: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt',
  },
  '@ethereumjs/binarytree': {
    BinaryTree: doc('binarytree', 'classes', 'BinaryTree'),
    StemBinaryNode: doc('binarytree', 'classes', 'StemBinaryNode'),
    verifyBinaryProof: doc('binarytree', 'functions', 'verifyBinaryProof'),
  },
  '@ethereumjs/block': {
    Block: doc('block', 'classes', 'Block'),
    BlockHeader: doc('block', 'classes', 'BlockHeader'),
    BlockOptions: doc('block', 'interfaces', 'BlockOptions'),
    createBlock: doc('block', 'functions', 'createBlock'),
    createBlockFromBytesArray: doc('block', 'functions', 'createBlockFromBytesArray'),
    createBlockFromRLP: doc('block', 'functions', 'createBlockFromRLP'),
  },
  '@ethereumjs/blockchain': {
    Blockchain: doc('blockchain', 'classes', 'Blockchain'),
  },
  '@ethereumjs/common': {
    AccountState: doc('common', 'type-aliases', 'AccountState'),
    BinaryTreeStateManagerInterface: doc('common', 'interfaces', 'BinaryTreeStateManagerInterface'),
    Chain: doc('common', 'variables', 'Chain'),
    ChainConfig: doc('common', 'interfaces', 'ChainConfig'),
    Common: doc('common', 'classes', 'Common'),
    GenesisState: doc('common', 'interfaces', 'GenesisState'),
    Mainnet: doc('common', 'variables', 'Mainnet'),
    StateManagerInterface: doc('common', 'interfaces', 'StateManagerInterface'),
    StorageRange: doc('common', 'interfaces', 'StorageRange'),
  },
  '@ethereumjs/evm': {
    createEVM: doc('evm', 'functions', 'createEVM'),
    EVM: doc('evm', 'classes', 'EVM'),
    'EVM.runCode': doc('evm', 'classes', 'EVM') + '#runCode',
    EVMMockBlockchain: doc('evm', 'classes', 'EVMMockBlockchain'),
    CustomOpcode: doc('evm', 'type-aliases', 'CustomOpcode'),
  },
  '@ethereumjs/genesis': {
    getGenesis: doc('genesis', 'functions', 'getGenesis'),
  },
  '@ethereumjs/mpt': {
    MerklePatriciaTrie: doc('mpt', 'classes', 'MerklePatriciaTrie'),
  },
  '@ethereumjs/statemanager': {
    MerkleStateManager: doc('statemanager', 'classes', 'MerkleStateManager'),
    SimpleStateManager: doc('statemanager', 'classes', 'SimpleStateManager'),
  },
  '@ethereumjs/tx': {
    TxOptions: doc('tx', 'interfaces', 'TxOptions'),
    create1559FeeMarketTxFromBytesArray: doc('tx', 'functions', 'create1559FeeMarketTxFromBytesArray'),
    createFeeMarket1559Tx: doc('tx', 'functions', 'createFeeMarket1559Tx'),
    createFeeMarket1559TxFromRLP: doc('tx', 'functions', 'createFeeMarket1559TxFromRLP'),
  },
  '@ethereumjs/util': {
    Address: doc('util', 'classes', 'Address'),
    BinaryTreeExecutionWitness: doc('util', 'interfaces', 'BinaryTreeExecutionWitness'),
    DB: doc('util', 'interfaces', 'DB'),
  },
  '@ethereumjs/vm': {
    emitEVMProfile: doc('vm', 'functions', 'emitEVMProfile'),
    VM: doc('vm', 'classes', 'VM'),
  },
}

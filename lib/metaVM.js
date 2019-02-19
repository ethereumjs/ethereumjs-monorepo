const StateManager = require('./stateManager.js')
const Common = require('ethereumjs-common').default
const Account = require('ethereumjs-account')
const Trie = require('merkle-patricia-tree/secure.js')
const fakeBlockchain = require('./fakeBlockChain.js')
const Buffer = require('safe-buffer').Buffer
const utils = require('ethereumjs-util')
const Block = require('ethereumjs-block')
const lookupOpInfo = require('./vm/opcodes.js')
const opFns = require('./vm/opFns.js')
const exceptions = require('./exceptions.js')
const StorageReader = require('./storageReader')

const BN = utils.BN
const ERROR = exceptions.ERROR
const VmError = exceptions.VmError

// find all the valid jumps and puts them in the `validJumps` array
function preprocessValidJumps (runState) {
  for (var i = 0; i < runState.code.length; i++) {
    var curOpCode = lookupOpInfo(runState.code[i]).name

    // no destinations into the middle of PUSH
    if (curOpCode === 'PUSH') {
      i += runState.code[i] - 0x5f
    }

    if (curOpCode === 'JUMPDEST') {
      runState.validJumps.push(i)
    }
  }
}

/**
 * An extensible base class for using the EVM.
 * @class MetaVM
 * @constructor
 * @param {Object} opts
 * @param {StateManager} opts.stateManager a [`StateManager`](stateManager.md) instance to use as the state store (Beta API)
 * @param {Trie} opts.state a merkle-patricia-tree instance for the state tree (ignored if stateManager is passed)
 * @param {Blockchain} opts.blockchain a blockchain object for storing/retrieving blocks (ignored if stateManager is passed)
 * @param {String|Number} opts.chain the chain the VM operates on [default: 'mainnet']
 * @param {String} opts.hardfork hardfork rules to be used [default: 'byzantium', supported: 'byzantium', 'constantinople', 'petersburg' (will throw on unsupported)]
 * @param {Boolean} opts.activatePrecompiles create entries in the state tree for the precompiled contracts
 * @param {Boolean} opts.allowUnlimitedContractSize allows unlimited contract sizes while debugging. By setting this to `true`, the check for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed. (default: `false`; ONLY set to `true` during debugging)
 * @param {Boolean} opts.emitFreeLogs Changes the behavior of the LOG opcode, the gas cost of the opcode becomes zero and calling it using STATICCALL won't throw. (default: `false`; ONLY set to `true` during debugging)
 */
class MetaVM {
  constructor (opts = {}) {
    const chain = opts.chain ? opts.chain : 'mainnet'
    const hardfork = opts.hardfork ? opts.hardfork : 'byzantium'
    const supportedHardforks = [
      'byzantium',
      'constantinople',
      'petersburg'
    ]

    this._common = new Common(chain, hardfork, supportedHardforks)

    if (opts.stateManager) {
      this.stateManager = opts.stateManager
    } else {
      const trie = opts.state || new Trie()

      if (opts.activatePrecompiles) {
        for (var i = 1; i <= 8; i++) {
          trie.put(new BN(i).toArrayLike(Buffer, 'be', 20), new Account().serialize())
        }
      }
      this.stateManager = new StateManager({ trie, common: this._common })
    }

    this.blockchain = opts.blockchain || fakeBlockchain
    this.allowUnlimitedContractSize = opts.allowUnlimitedContractSize === undefined ? false : opts.allowUnlimitedContractSize
    this.emitFreeLogs = opts.emitFreeLogs === undefined ? false : opts.emitFreeLogs

    // precompiled contracts
    this._precompiled = this.constructor.PRECOMPILED
  }

  /**
   * Checks if the execution given `runState` is not yet completed.
   * @method canContinueExecution
   * @memberof MetaVM
   * @param {Object} runState
   * @returns {boolean} Returns {@code true} if the execution is not yet completed.
   */
  canContinueExecution (runState) {
    const notAtEnd = runState.programCounter < runState.code.length
    const canContinue = !runState.stopped && notAtEnd && !runState.vmError && !runState.returnValue

    return canContinue
  }

  /**
   * Common function to create the VM (internal) `runState` object.
   * @method initRunState
   * @memberof MetaVM
   * @param {Object} opts
   * @param {Account} opts.account the [`Account`](https://github.com/ethereumjs/ethereumjs-account) that the executing code belongs to. If omitted an empty account will be used
   * @param {Buffer} opts.address the address of the account that is executing this code. The address should be a `Buffer` of bytes. Defaults to `0`
   * @param {Block} opts.block the [`Block`](https://github.com/ethereumjs/ethereumjs-block) the `tx` belongs to. If omitted a blank block will be used
   * @param {Buffer} opts.caller the address that ran this code. The address should be a `Buffer` of 20bits. Defaults to `0`
   * @param {Buffer} opts.code the EVM code to run given as a `Buffer`
   * @param {Buffer} opts.data the input data
   * @param {Buffer} opts.gasLimit the gas limit for the code
   * @param {Buffer} opts.origin the address where the call originated from. The address should be a `Buffer` of 20bits. Defaults to `0`
   * @param {Buffer} opts.value the value in ether that is being sent to `opt.address`. Defaults to `0`
   * @param {Number} opts.pc the initial program counter. Defaults to `0`
   * @returns {Object} Returns the initial `runState` object.
   */
  async initRunState (opts = {}) {
    // VM internal state
    const runState = {
      blockchain: this.blockchain,
      stateManager: this.stateManager,
      storageReader: opts.storageReader || new StorageReader(this.stateManager),
      returnValue: false,
      stopped: false,
      vmError: false,
      programCounter: opts.pc | 0,
      opCode: undefined,
      opName: undefined,
      stackIn: 0,
      stackOut: 0,
      gasLeft: new BN(opts.gasLimit),
      gasLimit: new BN(opts.gasLimit),
      gasPrice: opts.gasPrice,
      memory: [],
      memoryWordCount: new BN(0),
      stack: [],
      lastReturned: [],
      logs: [],
      validJumps: [],
      gasRefund: new BN(0),
      highestMemCost: new BN(0),
      depth: opts.depth || 0,
      // opts.suicides is kept for backward compatiblity with pre-EIP6 syntax
      selfdestruct: opts.selfdestruct || opts.suicides || {},
      block: opts.block || new Block(),
      callValue: opts.value || new BN(0),
      address: opts.address || utils.zeros(32),
      caller: opts.caller || utils.zeros(32),
      origin: opts.origin || opts.caller || utils.zeros(32),
      callData: opts.data || Buffer.from([0]),
      code: opts.code || Buffer.alloc(0),
      static: opts.static || false
    }

    // temporary - to be factored out
    runState._common = this._common
    runState._precompiled = this._precompiled
    runState._vm = this

    // preprocess valid jump locations
    preprocessValidJumps(runState)

    // ensure contract is loaded
    if (!runState.contract) {
      const stateManager = runState.stateManager
      const account = await new Promise(
        function (resolve, reject) {
          stateManager.getAccount(runState.address,
            function (err, account) {
              if (err) {
                reject(err)
                return
              }

              resolve(account)
            }
          )
        }
      )
      runState.contract = account
    }

    return runState
  }

  /**
   * Run the next execution step given `runState.programCounter`.
   * @method runNextStep
   * @memberof MetaVM
   * @param {Object} The runState object.
   */
  async runNextStep (runState) {
    const opCode = runState.code[runState.programCounter]
    const opInfo = lookupOpInfo(opCode, false, this.emitFreeLogs)
    const opName = opInfo.name

    runState.opName = opName
    runState.opCode = opCode
    runState.stackIn = opInfo.in
    runState.stackOut = opInfo.out

    // check for invalid opcode
    if (opName === 'INVALID') {
      throw new VmError(ERROR.INVALID_OPCODE)
    }

    // check for stack underflow
    if (runState.stack.length < opInfo.in) {
      throw new VmError(ERROR.STACK_UNDERFLOW)
    }

    // check for stack overflow
    if ((runState.stack.length - opInfo.in + opInfo.out) > 1024) {
      throw new VmError(ERROR.STACK_OVERFLOW)
    }

    // calculate gas
    runState.gasLeft = runState.gasLeft.subn(opInfo.fee)
    if (runState.gasLeft.ltn(0)) {
      runState.gasLeft = new BN(0)
      throw new VmError(ERROR.OUT_OF_GAS)
    }

    // advance program counter
    runState.programCounter++

    // if opcode is log and emitFreeLogs is enabled, remove static context
    const prevStatic = runState.static
    if (this.emitFreeLogs && opName === 'LOG') {
      runState.static = false
    }

    // run the opcode handler
    await this['handle' + opName](runState)

    // restore previous static context
    runState.static = prevStatic
  }

  /**
   * Runs the next `stepCount` steps given the `runState` object. If `stepCount` is `0`, the function runs until the vm execution ends.
   * @method run
   * @memberof MetaVM
   * @param {Object} runState
   * @param {Number} stepCount (Optional) The initial program counter. Defaults to `0`.
   */
  async run (runState, stepCount) {
    stepCount = stepCount | 0

    while (this.canContinueExecution(runState)) {
      await this.runNextStep(runState)

      if (stepCount !== 0) {
        if (--stepCount === 0) {
          break
        }
      }
    }
  }
}
MetaVM.PRECOMPILED = {
  '0000000000000000000000000000000000000001': require('./precompiled/01-ecrecover.js'),
  '0000000000000000000000000000000000000002': require('./precompiled/02-sha256.js'),
  '0000000000000000000000000000000000000003': require('./precompiled/03-ripemd160.js'),
  '0000000000000000000000000000000000000004': require('./precompiled/04-identity.js'),
  '0000000000000000000000000000000000000005': require('./precompiled/05-modexp.js'),
  '0000000000000000000000000000000000000006': require('./precompiled/06-ecadd.js'),
  '0000000000000000000000000000000000000007': require('./precompiled/07-ecmul.js'),
  '0000000000000000000000000000000000000008': require('./precompiled/08-ecpairing.js')
}

// generate the prototypes for `handle<OPCODE>`
for (let i = 0; i <= 0xff; i++) {
  const opInfo = lookupOpInfo(i)
  const opFn = opFns[opInfo.name]
  const handlerName = 'handle' + opInfo.name

  if (MetaVM.prototype[handlerName]) {
    continue
  }

  /**
   * Function(s) that handles the opcode, like `handleADD(runState)`. It serves the purpose to add custom logic.
   * @method handleOPCODE
   * @memberof MetaVM
   * @param {Object} runState
   */
  MetaVM.prototype[handlerName] = async function (state) {
    const argsNum = state.stackIn
    const retNum = state.stackOut
    // pop the stack
    const args = argsNum ? state.stack.splice(-argsNum) : []

    args.reverse()
    args.push(state)

    function handleResult (result) {
      // save result to the stack
      if (result !== undefined) {
        if (retNum !== 1) {
          // opcode post-stack mismatch
          throw new VmError(ERROR.INTERNAL_ERROR)
        }

        state.stack.push(result)
      } else {
        if (retNum !== 0) {
          // opcode post-stack mismatch
          throw new VmError(ERROR.INTERNAL_ERROR)
        }
      }
    }

    return new Promise(
      function (resolve, reject) {
        if (opInfo.async) {
          args.push(
            function (err, result) {
              if (err) {
                reject(err)
                return
              }

              handleResult(result)
              resolve()
            }
          )

          opFn.apply(null, args)
          return
        }

        handleResult(opFn.apply(null, args))
        resolve()
      }
    )
  }
}
module.exports = MetaVM

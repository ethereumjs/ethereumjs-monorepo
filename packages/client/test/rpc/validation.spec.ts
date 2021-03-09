import tape from 'tape'
import { middleware, validators } from '../../lib/rpc/validation'
import { INVALID_PARAMS } from '../../lib/rpc/error-code'
import { startRPC, baseRequest } from './helpers'
import { checkError } from './util'

const prefix = 'rpc/validation:'

tape(`${prefix} should work without \`params\` when it's optional`, (t) => {
  const mockMethodName = 'mock'
  const server = startRPC({
    [mockMethodName]: middleware((_params: any) => true, 0, []),
  })

  const req = {
    jsonrpc: '2.0',
    method: mockMethodName,
    id: 1,
  }
  const expectRes = (res: any) => {
    t.equal(res.body.error, undefined, 'should not return an error object')
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${prefix} should return error without \`params\` when it's required`, (t) => {
  const mockMethodName = 'mock'
  const server = startRPC({
    [mockMethodName]: middleware((_params: any) => true, 1, []),
  })

  const req = {
    jsonrpc: '2.0',
    method: mockMethodName,
    id: 1,
  }

  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 0')

  baseRequest(t, server, req, 200, expectRes)
})

const validatorResult = (result: Object | undefined) => {
  // result is valid if validator returns undefined
  // result is invalid if validator returns object
  return result === undefined ? true : false
}

tape(`${prefix} address`, (t) => {
  // valid
  // zero address
  t.ok(validatorResult(validators.address(['0x0000000000000000000000000000000000000000'], 0)))
  // lowercase address
  t.ok(validatorResult(validators.address(['0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270'], 0)))
  // checksummed address
  t.ok(validatorResult(validators.address(['0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270'], 0)))

  // invalid
  t.notOk(validatorResult(validators.address(['0x'], 0)))
  t.notOk(validatorResult(validators.address(['0x0'], 0)))
  t.notOk(validatorResult(validators.address(['0x00'], 0)))
  t.notOk(validatorResult(validators.address(['0x1'], 0)))
  // invalid length: 38 chars
  t.notOk(validatorResult(validators.address(['0x00000000000000000000000000000000000000'], 0)))
  // invalidlength: 39 chars
  t.notOk(validatorResult(validators.address(['0x000000000000000000000000000000000000000'], 0)))
  // invalidlength: 41 chars
  t.notOk(validatorResult(validators.address(['0x00000000000000000000000000000000000000000'], 0)))
  // invalid length: 42 chars
  t.notOk(validatorResult(validators.address(['0x00000000000000000000000000000000000000000'], 0)))
  // invalid character
  t.notOk(validatorResult(validators.address(['0x62223651d6a33d58be70eb9876c3caf7096169ez'], 0)))

  t.end()
})

tape(`${prefix} blockHash`, (t) => {
  // valid
  t.ok(
    validatorResult(
      validators.blockHash(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249'],
        0
      )
    )
  )
  t.ok(
    validatorResult(
      validators.blockHash(
        ['0xf79d019c58d58a4efcfdf100c9596dd38014dcec6cf6f52000d4fae4e139b703'],
        0
      )
    )
  )
  // invalid length
  t.notOk(
    validatorResult(
      validators.blockHash(['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a2'], 0)
    )
  )
  t.notOk(
    validatorResult(
      validators.blockHash(['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a24'], 0)
    )
  )
  t.notOk(
    validatorResult(
      validators.blockHash(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a2499'],
        0
      )
    )
  )
  t.notOk(
    validatorResult(
      validators.blockHash(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a24999'],
        0
      )
    )
  )
  // invalid character
  t.notOk(
    validatorResult(
      validators.blockHash(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66z249'],
        0
      )
    )
  )

  t.end()
})

tape(`${prefix} blockOption`, (t) => {
  // valid
  t.ok(validatorResult(validators.blockOption(['latest'], 0)))
  t.ok(validatorResult(validators.blockOption(['earliest'], 0)))
  t.ok(validatorResult(validators.blockOption(['pending'], 0)))
  t.ok(
    validatorResult(
      validators.blockOption(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249'],
        0
      )
    )
  )
  t.ok(validatorResult(validators.blockOption(['0x1'], 0)))
  t.ok(validatorResult(validators.blockOption(['0x01'], 0)))

  // invalid
  t.notOk(validatorResult(validators.blockOption(['lates'], 0)))
  t.notOk(validatorResult(validators.blockOption(['arliest'], 0)))
  t.notOk(validatorResult(validators.blockOption(['pendin'], 0)))
  t.notOk(validatorResult(validators.blockOption(['0'], 0)))
  t.notOk(validatorResult(validators.blockOption(['00'], 0)))
  t.notOk(validatorResult(validators.blockOption(['1'], 0)))
  t.notOk(validatorResult(validators.blockOption(['11'], 0)))
  t.notOk(
    validatorResult(
      validators.blockOption(
        ['573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249'],
        0
      )
    )
  )

  t.end()
})

tape(`${prefix} bool`, (t) => {
  // valid
  t.ok(validatorResult(validators.bool([true], 0)))
  t.ok(validatorResult(validators.bool([false], 0)))

  // invalid
  t.notOk(validatorResult(validators.bool(['true'], 0)))
  t.notOk(validatorResult(validators.bool(['false'], 0)))
  t.notOk(validatorResult(validators.bool(['tru'], 0)))
  t.notOk(validatorResult(validators.bool(['fals'], 0)))

  t.end()
})

tape(`${prefix} hex`, (t) => {
  // valid
  t.ok(validatorResult(validators.hex(['0x0'], 0)))
  t.ok(validatorResult(validators.hex(['0x00'], 0)))
  t.ok(validatorResult(validators.hex(['0x1'], 0)))

  // invalid
  t.notOk(validatorResult(validators.hex(['0'], 0)))
  t.notOk(validatorResult(validators.hex(['00'], 0)))
  t.notOk(validatorResult(validators.hex(['1'], 0)))
  t.notOk(validatorResult(validators.hex(['1'], 0)))

  t.end()
})

tape(`${prefix} transaction`, (t) => {
  // valid
  t.ok(validatorResult(validators.transaction([])([{}], 0)))
  t.ok(
    validatorResult(
      validators.transaction([])(
        [
          {
            gas: '0xcf08',
          },
        ],
        0
      )
    )
  )
  t.ok(
    validatorResult(
      validators.transaction(['to'])([{ to: '0x0000000000000000000000000000000000000000' }], 0)
    )
  )

  // invalid
  t.notOk(validatorResult(validators.transaction([])([], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{}], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{ gas: '0xcf08' }], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{ to: '0x' }], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{ to: '0x0' }], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{ to: '0x00' }], 0)))
  t.notOk(
    validatorResult(
      validators.transaction(['to'])(
        [
          {
            to: '0x0000000000000000000000000000000000000000',
            from: '0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249',
          },
        ],
        0
      )
    )
  )
  t.notOk(
    validatorResult(
      validators.transaction(['to'])(
        [{ from: '0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249' }],
        0
      )
    )
  )
  t.notOk(validatorResult(validators.transaction([])([{ gas: '12' }], 0)))
  t.notOk(validatorResult(validators.transaction([])([{ gasPrice: '12' }], 0)))
  t.notOk(validatorResult(validators.transaction([])([{ value: '12' }], 0)))
  t.notOk(validatorResult(validators.transaction([])([{ data: '12' }], 0)))

  t.end()
})

import { toBuffer } from '@ethereumjs/util'
import * as tape from 'tape'

import { EOFContainer } from '../../src/eof/container'

enum Change {
  MAGIC = 0,
  VERSION = 2,
  KIND_TYPE = 3,
  TYPE_SIZE = 5,
  KIND_CODE = 6,
  CODE_SIZE = 7,
  KIND_DATA = 15,
  DATA_SIZE = 17,
  TERMINATOR = 18,
  CODE_INPUT = 19,
  CODE_OUTPUT = 20,
}

tape('EOF Container Constructor Test', (t) => {
  const valid =
    '0xef000101000c020003000d0002000303000000000000000201000000010000b00002b00002b000016000550001b16005b1'
  function invalidate(pos: number) {
    const buf = toBuffer(valid)
    buf[pos] = buf[pos] + 1
    return buf
  }
  function curruptMSH() {
    const buf = toBuffer(valid)
    buf[21] = 0x04
    return buf
  }
  // function zeroCode() {
  //   const buf = toBuffer(valid)
  //   buf.set([0], 5)
  //   return buf
  // }
  t.test('test CALLF/RETF execution', async (st) => {
    const cases = [
      {
        name: 'MAGIC',
        code: invalidate(Change.MAGIC),
        err: 'Bytes do not match expected value at pos: 0: header should start with magic bytes: 0xEF00',
      },
      {
        name: 'VERSION',
        code: invalidate(Change.VERSION),
        err: `Uint does not match expected value at pos: 2: Version should be 1`,
      },
      {
        name: 'KIND_TYPE',
        code: invalidate(Change.KIND_TYPE),
        err: 'Uint does not match expected value at pos: 3: type section marker 0x01 expected',
      },
      {
        name: 'TYPE_SIZE',
        code: invalidate(Change.TYPE_SIZE),
        err: 'invalid type size: should be at least 4 and should be a multiple of 4. got: 13',
      },
      {
        name: 'TYPE_SIZE',
        code: toBuffer(valid).subarray(0, 4),
        err: 'Trying to read out of bounds at pos: 4: missing type size',
      },
      {
        name: 'TYPE_SIZE',
        code: toBuffer(valid).subarray(0, 5),
        err: 'Trying to read out of bounds at pos: 4: missing type size',
      },
      {
        name: 'KIND_CODE',
        code: invalidate(Change.KIND_CODE),
        err: 'Uint does not match expected value at pos: 6: code section marker 0x02 expected',
      },
      // {
      //   name: 'CODE_SIZE',
      //   code: zeroCode(),
      //   err: 'should at least have 1 code section',
      // },
      {
        name: 'CODE_SIZE',
        code: invalidate(Change.CODE_SIZE),
        err: 'need to have a type section for each code section',
      },
      {
        name: 'CODE_SIZE',
        code: toBuffer(valid).slice(0, 7),
        err: 'Trying to read out of bounds at pos: 7: missing code size',
      },
      {
        name: 'CODE_SIZE',
        code: toBuffer(valid).slice(0, 9),
        err: 'Trying to read out of bounds at pos: 9: expected a code section',
      },
      {
        name: 'CODE_SIZE',
        code: toBuffer(valid).slice(0, 11),
        err: 'Trying to read out of bounds at pos: 11: expected a code section',
      },
      {
        name: 'CODE_SIZE',
        code: toBuffer(valid).slice(0, 13),
        err: 'Trying to read out of bounds at pos: 13: expected a code section',
      },
      {
        name: 'KIND_DATA',
        code: invalidate(Change.KIND_DATA),
        err: 'Uint does not match expected value at pos: 15: data section marker 0x03 expected',
      },
      {
        name: 'DATA_SIZE',
        code: toBuffer(valid).slice(0, 16),
        err: 'Trying to read out of bounds at pos: 16: missing data size',
      },

      {
        name: 'DATA_SIZE',
        code: invalidate(Change.DATA_SIZE),
        err: 'Trying to read out of bounds at pos: 30: Expected data section',
      },
      {
        name: 'CODE_INPUT',
        code: invalidate(Change.CODE_INPUT),
        err: 'first code section should have 0 inputs',
      },
      {
        name: 'TERMINATOR',
        code: invalidate(Change.TERMINATOR),
        err: 'Uint does not match expected value at pos: 18: terminator 0x00 expected',
      },
      {
        name: 'CODE_OUTPUT',
        code: invalidate(Change.CODE_OUTPUT),
        err: 'first code section should have 0 outputs',
      },
      {
        name: 'CODE_MSH',
        code: curruptMSH(),
        err: 'stack height limit of 1024 exceeded: , got: 1024 - typeSection 0',
      },
      {
        name: 'INPUT',
        code: toBuffer(valid).slice(0, 19),
        err: 'Trying to read out of bounds at pos: 0: expected inputs',
      },
      {
        name: 'OUTPUT',
        code: toBuffer(valid).slice(0, 20),
        err: 'Trying to read out of bounds at pos: 1: expected outputs',
      },
      {
        name: 'CODE_MSH',
        code: toBuffer(valid).slice(0, 22),
        err: 'Trying to read out of bounds at pos: 2: expected maxStackHeight',
      },
      {
        name: 'CODE',
        code: toBuffer(valid).slice(0, 32),
        err: 'expected code: codeSection 0: ',
      },
      {
        name: 'DANGLING',
        code: Buffer.concat([toBuffer(valid), Buffer.from([123])]),
        err: 'got dangling bytes in body',
      },
    ]
    try {
      new EOFContainer(toBuffer(valid))
      st.pass('Should build EOFContainer from valid EOF code')
    } catch (e) {
      st.fail(`'Should build EOFContainer from valid EOF code': ${(e as any).message}`)
    }
    for (const { name, code, err } of cases) {
      try {
        new EOFContainer(code)
        st.fail(`Should fail to build EOFContainer with invalid ${name} bytes`)
      } catch (e) {
        st.equal(
          (e as any).message,
          err,
          `Should fail to build EOFContainer with invalid ${name} bytes`
        )
      }
    }

    t.end()
  })
})

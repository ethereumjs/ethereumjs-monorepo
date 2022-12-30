import { toBuffer } from '@ethereumjs/util'
import tape from 'tape'

import { EOFContainer } from '../../src/eof/eofContainer'

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
    buf.set([buf[pos] + 1], pos)
    return buf
  }
  function curruptMSH() {
    const buf = toBuffer(valid)
    buf[21] = 0x04
    return buf
  }
  function zeroCode() {
    const buf = toBuffer(valid)
    buf[8] = 0x00
    return buf
  }
  t.test('test CALLF/RETF execution', async (st) => {
    const cases = [
      {
        name: 'MAGIC',
        code: invalidate(Change.MAGIC),
        err: 'pos: 0: header should start with magic bytes',
      },
      {
        name: 'VERSION',
        code: invalidate(Change.VERSION),
        err: `pos: 2: version should be 1`,
      },
      {
        name: 'KIND_TYPE',
        code: invalidate(Change.KIND_TYPE),
        err: 'pos: 3: type section marker (1) expected',
      },
      {
        name: 'TYPE_SIZE',
        code: invalidate(Change.TYPE_SIZE),
        err: 'invalid type size: should be at least 4 and should be a multiple of 4. got: 13',
      },
      {
        name: 'TYPE_SIZE',
        code: toBuffer(valid).subarray(0, 4),
        err: 'pos: 4: trying to read out of bounds: missing type size',
      },
      {
        name: 'TYPE_SIZE',
        code: toBuffer(valid).subarray(0, 5),
        err: 'pos: 4: trying to read out of bounds: missing type size',
      },
      {
        name: 'KIND_CODE',
        code: invalidate(Change.KIND_CODE),
        err: 'pos: 6: code section marker (2) expected',
      },
      {
        name: 'CODE_SIZE',
        code: zeroCode(),
        err: 'should at least have 1 code section',
      },
      {
        name: 'CODE_SIZE',
        code: invalidate(Change.CODE_SIZE),
        err: 'need to have a type section for each code section',
      },
      {
        name: 'CODE_SIZE',
        code: toBuffer(valid).slice(0, 7),
        err: 'pos: 7: trying to read out of bounds: missing code size',
      },
      {
        name: 'CODE_SIZE',
        code: toBuffer(valid).slice(0, 9),
        err: 'pos: 9: trying to read out of bounds: expected a code section',
      },
      {
        name: 'CODE_SIZE',
        code: toBuffer(valid).slice(0, 11),
        err: 'pos: 11: trying to read out of bounds: expected a code section',
      },
      {
        name: 'CODE_SIZE',
        code: toBuffer(valid).slice(0, 13),
        err: 'pos: 13: trying to read out of bounds: expected a code section',
      },
      {
        name: 'KIND_DATA',
        code: invalidate(Change.KIND_DATA),
        err: 'pos: 15: data section marker (3) expected',
      },
      {
        name: 'DATA_SIZE',
        code: toBuffer(valid).slice(0, 16),
        err: 'pos: 16: trying to read out of bounds: missing data size',
      },

      {
        name: 'DATA_SIZE',
        code: invalidate(Change.DATA_SIZE),
        err: 'pos: 30: trying to read out of bounds: data section body expected',
      },
      {
        name: 'CODE_INPUT',
        code: invalidate(Change.CODE_INPUT),
        err: 'type section body: first code section should have 0 inputs',
      },
      {
        name: 'TERMINATOR',
        code: invalidate(Change.TERMINATOR),
        err: 'pos: 18: 0 terminator expected',
      },
      {
        name: 'CODE_OUTPUT',
        code: invalidate(Change.CODE_OUTPUT),
        err: 'type section body: first code section should have 0 outputs',
      },
      {
        name: 'CODE_MSH',
        code: curruptMSH(),
        err: 'type section body: max stack height should be at most 1023, got 1024',
      },
      {
        name: 'INPUT',
        code: toBuffer(valid).slice(0, 19),
        err: 'pos: 0: trying read out of bounds: type section body: expected input',
      },
      {
        name: 'OUTPUT',
        code: toBuffer(valid).slice(0, 20),
        err: 'pos: 1: trying read out of bounds: type section body: expected output',
      },
      {
        name: 'CODE_MSH',
        code: toBuffer(valid).slice(0, 22),
        err: 'pos: 2: trying to read out of bounds: type section body: expected max stack height',
      },
      {
        name: 'CODE',
        code: toBuffer(valid).slice(0, 43),
        err: 'pos: 12: trying to read out of bounds: code section body: expected code',
      },
      {
        name: 'CODE',
        code: toBuffer(valid).slice(0, 45),
        err: 'pos: 25: trying to read out of bounds: code section body: expected code',
      },
      {
        name: 'CODE',
        code: toBuffer(valid).slice(0, 48),
        err: 'pos: 27: trying to read out of bounds: code section body: expected code',
      },
      {
        name: 'DANGLING',
        code: toBuffer(valid + 'ff'),
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

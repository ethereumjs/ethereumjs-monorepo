import * as tape from 'tape'

/**
 *
 * IMPORTANT NOTE, THESE TESTS USE COPYRIGHTED BESU TESTS AND SHOULD BE CLEANED UP BEFORE THIS PR IS MERGED
 *
 *
 */

import { EOF } from '../../src/eof'

// Tests taken from https://github.com/hyperledger/besu/blob/main/evm/src/test/java/org/hyperledger/besu/evm/code/EOFLayoutTest.java
tape('container validation - invalid', (t) => {
  const cases: [string, string, string, number][] = [
    ['EF', 'No magic', 'EOF Container too small', -1],
    ['FFFFFF', 'Wrong magic', 'EOF header byte 0 incorrect', -1],
    ['EFFF01010002020004006000AABBCCDD', 'Invalid magic', 'EOF header byte 1 incorrect', -1],
    ['EF00', 'No version', 'EOF Container too small', -1],
    ['EF0000010002020004006000AABBCCDD', 'Invalid version', 'Unsupported EOF Version 0', 0],
    ['EF0002010002020004006000AABBCCDD', 'Invalid version', 'Unsupported EOF Version 2', 2],
    ['EF00FF010002020004006000AABBCCDD', 'Invalid version', 'Unsupported EOF Version 255', 255],
    ['EF0001', 'No header', 'Improper section headers', 1],
    ['EF0001 00', 'No code section', 'Expected kind 1 but read kind 0', 1],
    ['EF0001 01', 'No code section size', 'Invalid Types section size', 1],
    ['EF0001 0100', 'Code section size incomplete', 'Invalid Types section size', 1],
    ['EF0001 010004', 'No section terminator', 'Improper section headers', 1],
    ['EF0001 010004 00', 'No code section contents', 'Expected kind 2 but read kind 0', 1],
    ['EF0001 010004 02', 'No code section count', 'Invalid Code section count', 1],
    ['EF0001 010004 0200', 'Short code section count', 'Invalid Code section count', 1],
    ['EF0001 010004 020001', 'No code section size', 'Invalid Code section size for section 0', 1],
    [
      'EF0001 010004 02000100',
      'Short code section size',
      'Invalid Code section size for section 0',
      1,
    ],
    [
      'EF0001 010008 0200020001',
      'No code section size multiple codes',
      'Invalid Code section size for section 1',
      1,
    ],
    [
      'EF0001 010008 020002000100',
      'No code section size multiple codes',
      'Invalid Code section size for section 1',
      1,
    ],
    ['EF0001 010004 0200010001 03', 'No data section size', 'Invalid Data section size', 1],
    ['EF0001 010004 0200010001 0300', 'Short data section size', 'Invalid Data section size', 1],
    ['EF0001 010004 0200010001 030000', 'No Terminator', 'Improper section headers', 1],
    ['EF0001 010008 0200010002 030000 00', 'No type section', 'Incomplete type section', 1],
    [
      'EF0001 010008 0200010002 030001 030001 00 DA DA',
      'Duplicate data sections',
      'Expected kind 0 but read kind 3',
      1,
    ],
    [
      'EF0001 010008 0200010002 030000 00 00',
      'Incomplete type section',
      'Incomplete type section',
      1,
    ],
    [
      'EF0001 010008 02000200020002 030000 00 00000000FE',
      'Incomplete type section',
      'Incomplete type section',
      1,
    ],
    [
      'EF0001 010008 02000200020002 030000 00 0100000000000000',
      'Incorrect section zero type input',
      'Code section does not have zero inputs and outputs',
      1,
    ],
    [
      'EF0001 010008 02000200020002 030000 00 0001000000000000',
      'Incorrect section zero type output',
      'Code section does not have zero inputs and outputs',
      1,
    ],
    [
      'EF0001 010008 0200010002 030000 00 00000000 ',
      'Incomplete code section',
      'Incomplete code section 0',
      1,
    ],
    [
      'EF0001 010008 0200010002 030000 00 00000000 FE',
      'Incomplete code section',
      'Incomplete code section 0',
      1,
    ],
    [
      'EF0001 010008 02000200020002 030000 00 00000000 00000000 FEFE ',
      'No code section multiple',
      'Incomplete code section 1',
      1,
    ],
    [
      'EF0001 010008 02000200020002 030000 00 00000000 00000000 FEFE FE',
      'Incomplete code section multiple',
      'Incomplete code section 1',
      1,
    ],
    [
      'EF0001 010008 0200010001 030003 00 00000000 FE DEADBEEF',
      'Incomplete data section',
      'Dangling data after end of all sections',
      1,
    ],
    [
      'EF0001 010008 0200010001 030003 00 00000000 FE BEEF',
      'Incomplete data section',
      'Incomplete data section',
      1,
    ],
    [
      'EF0001 0200010001 030001 00 FE DA',
      'type section missing',
      'Expected kind 1 but read kind 2',
      1,
    ],
    [
      'EF0001 010004 030001 00 00000000 DA',
      'code section missing',
      'Expected kind 2 but read kind 3',
      1,
    ],
    [
      'EF0001 010004 0200010001 00 00000000 FE',
      'data section missing',
      'Expected kind 3 but read kind 0',
      1,
    ],
    ['EF0001 030001 00 DA', 'type and code section missing', 'Expected kind 1 but read kind 3', 1],
    [
      'EF0001 0200010001 00 FE',
      'type and data section missing',
      'Expected kind 1 but read kind 2',
      1,
    ],
    [
      'EF0001 010004 00 00000000',
      'code and data sections missing',
      'Expected kind 2 but read kind 0',
      1,
    ],
    ['EF0001 00', 'all sections missing', 'Expected kind 1 but read kind 0', 1],
    [
      'EF0001 010004 020401' +
        ' 0001'.repeat(1025) +
        ' 030000 00' +
        ' 00000000'.repeat(1025) +
        ' FE'.repeat(1025),
      'no data section, 1025 code sections',
      'Too many code sections - 0x401',
      1,
    ],
  ]
  for (const testCase of cases) {
    const str = testCase[0].replace(/\s/g, '')
    const bytes = Buffer.from(str, 'hex')
    if (EOF.validateCode(bytes)) {
      t.fail(str + ': ' + testCase[2])
      break
    } else {
      t.pass(str + ': ' + testCase[2])
    }
  }
  t.end()
})

// Tests taken from https://github.com/hyperledger/besu/blob/main/evm/src/test/java/org/hyperledger/besu/evm/code/EOFLayoutTest.java
tape('container validation - valid', (t) => {
  const cases: [string, string, null, number][] = [
    [
      'EF0001 010004 0200010001 030000 00 00000000 FE',
      'no data section, one code section',
      null,
      1,
    ],
    [
      'EF0001 010004 0200010001 030001 00 00000000 FE DA',
      'with data section, one code section',
      null,
      1,
    ],
    [
      'EF0001 010008 02000200010001 030000 00 00000000 00000000 FE FE',
      'no data section, multiple code section',
      null,
      1,
    ],
    [
      'EF0001 010008 02000200010001 030001 00 00000000 00000000 FE FE DA',
      'with data section, multiple code section',
      null,
      1,
    ],
    [
      'EF0001 010010 0200040001000200020002 030000 00 00000000 01000000 00010000 02030000 FE 5000 3000 8000',
      'non-void input and output types',
      null,
      1,
    ],
    [
      // TODO: VERIFY ME, this test is changed. OG was 'EF0001 010004 020400'
      // (type section of size 4)
      // But this should be of size 1024 * 4, right??
      'EF0001 011000 020400' +
        ' 0001'.repeat(1024) +
        ' 030000 00' +
        ' 00000000'.repeat(1024) +
        ' FE'.repeat(1024),
      'no data section, 1024 code sections',
      null,
      1,
    ],
  ]
  for (const testCase of cases) {
    const str = testCase[0].replace(/\s/g, '')

    const bytes = Buffer.from(str, 'hex')
    if (!EOF.validateCode(bytes)) {
      t.fail(str)
      break
    } else {
      t.pass('verified container')
    }
  }
  t.end()
})

// Tests taken from https://github.com/hyperledger/besu/blob/main/evm/src/test/java/org/hyperledger/besu/evm/code/EOFLayoutTest.java
tape('container validation - invalid type section', (t) => {
  const cases: [string, string, string | null, number][] = [
    [
      // NOTE: edited, added code at the end (JUMPDEST INVALID JUMPDEST INVALID)
      // NOTE: JUMPDEST does not pop or push any stack items and is therefore a NOP operation
      'EF0001 010008 02000200020002 030000 00 0100000000000000 5BFE5BFE',
      'Incorrect section zero type input',
      'Code section does not have zero inputs and outputs',
      1,
    ],
    [
      'EF0001 010008 02000200020002 030000 00 0001000000000000',
      'Incorrect section zero type output',
      'Code section does not have zero inputs and outputs',
      1,
    ],
    [
      'EF0001 010010 0200040001000200020002 030000 00 00000000 80000000 00010000 02030000 FE 5000 3000 8000',
      'inputs too large',
      'Type data input stack too large - 0x80',
      1,
    ],
    [
      'EF0001 010010 0200040001000200020002 030000 00 00000000 01000000 00800000 02030000 FE 5000 3000 8000',
      'outputs too large',
      'Type data output stack too large - 0x80',
      1,
    ],
    [
      'EF0001 010010 0200040001000200020002 030000 00 00000400 01000000 00010000 02030400 FE 5000 3000 8000',
      'stack too large',
      'Type data max stack too large - 0x400',
      1,
    ],
    [
      'EF0001 010010 0200040001000200020002 030000 00 00000000 01000000 00010000 02030000 FE 5000 3000 8000',
      'non-void input and output types',
      null,
      1,
    ],
  ]
  for (const testCase of cases) {
    const str = testCase[0].replace(/\s/g, '')
    const bytes = Buffer.from(str, 'hex')
    if (testCase[2] === null) {
      if (!EOF.validateCode(bytes)) {
        t.fail(str)
        break
      } else {
        t.pass(str)
      }
    } else {
      if (EOF.validateCode(bytes)) {
        t.fail(str + ': ' + testCase[2])
        break
      } else {
        t.pass(str + ': ' + testCase[2])
      }
    }
  }
  t.end()
})

const { padToEven } = require('ethereumjs-util')

// convert an input Buffer to a mcl G1 point
// this does /NOT/ do any input checks. the input Buffer needs to be of length 128
function BLS12_381_ToG1Point(input: Buffer, mcl: any): any {
  const p_x = input.slice(16, 64).toString('hex')
  const p_y = input.slice(80, 128).toString('hex')

  const pstr = '1 ' + p_x + ' ' + p_y
  const mclPoint = new mcl.G1()

  mclPoint.setStr(pstr, 16)

  return mclPoint
}

// input: a mcl G1 point
// output: a 128-byte Buffer
function BLS12_381_FromG1Point(input: any): Buffer {
  // TODO: figure out if there is a better way to decode these values.
  let decodeStr = input.getStr(16) //return a string of pattern "1 <x_coord> <y_coord>"
  let decoded = decodeStr.match(/"?[0-9a-f]+"?/g) // match above pattern.

  // note: decoded[0] == 1
  let xval = padToEven(decoded[1])
  let yval = padToEven(decoded[2])

  // convert to buffers.

  let xBuffer = Buffer.concat([Buffer.alloc(64 - xval.length / 2, 0), Buffer.from(xval, 'hex')])
  let yBuffer = Buffer.concat([Buffer.alloc(64 - yval.length / 2, 0), Buffer.from(yval, 'hex')])

  return Buffer.concat([xBuffer, yBuffer])
}

export { BLS12_381_ToG1Point, BLS12_381_FromG1Point }
